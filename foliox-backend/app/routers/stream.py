import asyncio
import json
from fastapi import APIRouter, HTTPException, Request
from sse_starlette.sse import EventSourceResponse
from app.services.cache import cache
from app.services.pdf_parser import parse_statement
from app.services.xirr import calculate_fund_xirr, calculate_portfolio_xirr, build_timeline
from app.services.overlap import build_overlap_matrix
from app.services.benchmark import get_nifty50_xirr
from app.services.health_score import calculate_health_score
from app.services.expense import calculate_expense_drag
from app.services.ai_agent import generate_recommendations
from app.utils.amfi import (
    get_nav_by_isin, classify_fund_category,
    is_direct_plan, get_typical_expense_ratio
)
from datetime import date
from app.utils.logger import get_logger

log = get_logger(__name__)
router = APIRouter()

def sse_event(step: int, total: int, message: str, data: dict = None) -> dict:
    """Format a progress event for the frontend stepper."""
    payload = {
        "step": step,
        "total": total,
        "message": message,
        "percent": round((step / total) * 100),
        "data": data or {},
    }
    return {"data": json.dumps(payload, default=str)}

@router.get("/stream/{session_id}")
async def stream_analysis(session_id: str, request: Request):
    """
    SSE endpoint. Frontend connects here and receives
    real-time progress events as analysis runs step by step.
    
    Frontend usage:
        const es = new EventSource(`/api/stream/${sessionId}`);
        es.onmessage = (e) => updateStepper(JSON.parse(e.data));
    """
    session = await cache.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    async def event_generator():
        try:
            TOTAL_STEPS = 8
            language = session.get("language", "en")
            investor_name = session.get("investor_name")
            
            # Step 1 — Read PDF
            yield sse_event(1, TOTAL_STEPS, "Reading your statement...")
            await asyncio.sleep(0.1)
            
            file_bytes = await cache.get_file(session_id)
            if not file_bytes:
                yield {"data": json.dumps({
                    "error": True,
                    "message": "Statement file expired. Please re-upload."
                })}
                return
            
            try:
                raw_holdings, stmt_type = await parse_statement(
                    file_bytes, session.get("filename", "statement.pdf")
                )
            except Exception as e:
                yield {"data": json.dumps({
                    "error": True,
                    "message": f"Could not parse statement: {str(e)}"
                })}
                return
            
            if not raw_holdings:
                yield {"data": json.dumps({
                    "error": True,
                    "message": "No fund transactions found in this statement."
                })}
                return
            
            yield sse_event(1, TOTAL_STEPS, 
                f"Found {len(raw_holdings)} funds with transactions",
                {"funds_found": len(raw_holdings), "statement_type": stmt_type})
            
            # Step 2 — Calculate XIRR
            yield sse_event(2, TOTAL_STEPS, "Calculating your true returns (XIRR)...")
            await asyncio.sleep(0.2)
            
            today = date.today()
            funds_data = []
            all_transactions_combined = []
            
            for holding in raw_holdings:
                isin = holding.get("isin", "")
                fund_name = holding["fund_name"]
                transactions = holding["transactions"]
                
                current_nav = get_nav_by_isin(isin) if isin else None
                if not current_nav:
                    current_nav = transactions[-1].nav if transactions else 1.0
                
                total_units = holding["total_units"]
                current_value = current_nav * total_units
                invested = sum(abs(t.amount) for t in transactions if t.amount < 0)
                
                category = classify_fund_category(fund_name)
                is_direct = is_direct_plan(fund_name)
                expense_ratio = get_typical_expense_ratio(category, is_direct)
                
                fund_xirr = calculate_fund_xirr(
                    transactions, current_nav, total_units, today
                )
                
                # Keep transactions as objects for internal calc
                fund_dict = {
                    "fund_name": fund_name,
                    "isin": isin,
                    "scheme_code": None,
                    "category": category,
                    "amc": fund_name.split()[0],
                    "transactions": transactions, # List[Transaction] objects
                    "current_nav": current_nav,
                    "total_units": total_units,
                    "current_value": current_value,
                    "invested_amount": invested,
                    "xirr": fund_xirr,
                    "expense_ratio": expense_ratio,
                    "is_direct_plan": is_direct,
                }
                funds_data.append(fund_dict)
                # For portfolio-wide: use date objects from original transactions
                all_transactions_combined.extend(
                    [(t.date, t.amount) for t in transactions]
                )
            
            total_invested = sum(f["invested_amount"] for f in funds_data)
            total_value = sum(f["current_value"] for f in funds_data)
            portfolio_xirr = calculate_portfolio_xirr(
                all_transactions_combined, total_value, today
            )
            
            yield sse_event(2, TOTAL_STEPS,
                f"Portfolio XIRR: {portfolio_xirr*100:.1f}% p.a.",
                {"portfolio_xirr": portfolio_xirr, "total_value": total_value})
            
            # Step 3 — Benchmark comparison
            yield sse_event(3, TOTAL_STEPS, "Comparing to Nifty 50 benchmark...")
            await asyncio.sleep(0.1)
            
            # Get earliest investment date for benchmark comparison
            all_raw_dates = [t.date for holding in raw_holdings for t in holding["transactions"]]
            earliest_date = min(all_raw_dates) if all_raw_dates else today
            
            benchmark_xirr = await get_nifty50_xirr(earliest_date, today)
            
            outperforming = portfolio_xirr > benchmark_xirr
            yield sse_event(3, TOTAL_STEPS,
                f"{'Beating' if outperforming else 'Lagging'} Nifty 50 by "
                f"{abs((portfolio_xirr - benchmark_xirr)*100):.1f}%",
                {"benchmark_xirr": benchmark_xirr, "outperforming": outperforming})
            
            # Step 4 — Overlap analysis
            yield sse_event(4, TOTAL_STEPS, "Checking fund overlap...")
            await asyncio.sleep(0.2)
            
            overlap_pairs = build_overlap_matrix(funds_data)
            high_overlap = [p for p in overlap_pairs if p["overlap_percentage"] > 50]
            
            yield sse_event(4, TOTAL_STEPS,
                f"Found {len(high_overlap)} high-overlap fund pairs",
                {"overlap_pairs_count": len(overlap_pairs),
                 "high_overlap_count": len(high_overlap)})
            
            # Step 5 — Expense analysis
            yield sse_event(5, TOTAL_STEPS, "Calculating expense ratio drag...")
            await asyncio.sleep(0.1)
            
            weighted_er = sum(
                f["expense_ratio"] * f["current_value"] for f in funds_data
            ) / total_value if total_value > 0 else 0.018
            
            expense = calculate_expense_drag(total_value, weighted_er, portfolio_xirr)
            
            yield sse_event(5, TOTAL_STEPS,
                f"10-year expense drag: Rs. {expense['ten_year_drag_rupees']:,.0f}",
                {"weighted_er": weighted_er,
                 "ten_year_drag": expense["ten_year_drag_rupees"]})
            
            # Step 6 — Health score
            yield sse_event(6, TOTAL_STEPS, "Computing your Portfolio Health Score...")
            await asyncio.sleep(0.1)
            
            categories = {f["category"]: f["current_value"] for f in funds_data}
            has_sip = any(
                "sip" in t.description.lower()
                for f in funds_data for t in f["transactions"]
            )
            health = calculate_health_score(
                portfolio_xirr=portfolio_xirr,
                benchmark_xirr=benchmark_xirr,
                overlap_pairs=overlap_pairs,
                weighted_expense_ratio=weighted_er,
                num_funds=len(funds_data),
                has_sip=has_sip,
                categories=categories,
            )
            
            yield sse_event(6, TOTAL_STEPS,
                f"Health Score: {health['total_score']}/100",
                {"health_score": health["total_score"]})
            
            # Step 7 — AI recommendations
            yield sse_event(7, TOTAL_STEPS,
                "Generating your personalised action plan...")
            await asyncio.sleep(0.1)
            
            ai_input = {
                "total_invested": total_invested,
                "total_current_value": total_value,
                "portfolio_xirr": portfolio_xirr,
                "benchmark_xirr": benchmark_xirr,
                "health_score": health["total_score"],
                "funds": [
                    {
                        "fund_name": f["fund_name"],
                        "category": f["category"],
                        "xirr": f["xirr"],
                        "current_value": f["current_value"],
                        "expense_ratio": f["expense_ratio"],
                        "is_direct_plan": f["is_direct_plan"],
                    } for f in funds_data
                ],
                "overlap_pairs": overlap_pairs,
                "weighted_expense_ratio": weighted_er,
                "ten_year_drag": expense["ten_year_drag_rupees"],
            }
            
            ai_output = await generate_recommendations(ai_input, language)
            
            # Step 8 — Assemble and cache result
            yield sse_event(8, TOTAL_STEPS, "Finalising your report...")

            timeline = build_timeline(
                all_transactions_combined,
                total_value, today
            )
            
            category_breakdown = {}
            for f in funds_data:
                cat = f["category"]
                pct = (f["current_value"] / total_value * 100) if total_value > 0 else 0
                category_breakdown[cat] = round(
                    category_breakdown.get(cat, 0) + pct, 1
                )
            
            # Step 8 — Assemble and cache result
            yield sse_event(8, TOTAL_STEPS, "Finalising your report...")
            
            # Final serialisation of fund objects
            serialised_funds = []
            for f in funds_data:
                f_copy = f.copy()
                f_copy["transactions"] = [t.model_dump() for t in f["transactions"]]
                serialised_funds.append(f_copy)

            result = {
                "session_id": session_id,
                "investor_name": investor_name,
                "language": language,
                "statement_type": stmt_type,
                "total_invested": round(total_invested, 2),
                "total_current_value": round(total_value, 2),
                "total_xirr": round(portfolio_xirr, 6),
                "funds": serialised_funds,
                "overlap_matrix": overlap_pairs,
                "benchmark": {
                    "benchmark_name": "Nifty 50",
                    "benchmark_xirr": round(benchmark_xirr, 6),
                    "portfolio_xirr": round(portfolio_xirr, 6),
                    "outperforming": portfolio_xirr > benchmark_xirr,
                    "alpha": round(portfolio_xirr - benchmark_xirr, 6),
                },
                "health_score": health,
                "expense_drag": expense,
                "ai_recommendations": ai_output.get("recommendations", []),
                "portfolio_summary": ai_output.get("summary", ""),
                "timeline": timeline,
                "fund_categories_breakdown": category_breakdown,
                "analysis_timestamp": str(today),
            }
            
            # Cache result for report download
            await cache.cache_analysis(session_id, result)
            await cache.update_session(session_id, {"status": "complete"})
            
            # Final event with complete result
            yield {"data": json.dumps({
                "step": 8,
                "total": 8,
                "percent": 100,
                "message": "Analysis complete!",
                "complete": True,
                "result": result,
            }, default=str)}
            
            log.info("analysis_complete", session_id=session_id,
                     funds=len(funds_data), score=health["total_score"])
        
        except Exception as e:
            import traceback
            log.error("stream_error", session_id=session_id, error=str(e), trace=traceback.format_exc())
            yield {"data": json.dumps({
                "error": True,
                "message": f"Analysis failed: {str(e)}. Please try again."
            })}
    
    return EventSourceResponse(event_generator())
