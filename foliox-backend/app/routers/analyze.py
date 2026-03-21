from fastapi import APIRouter, HTTPException, BackgroundTasks
from datetime import date, datetime
from app.dependencies import session_store
from app.services.pdf_parser import parse_statement
from app.services.xirr import (
    calculate_fund_xirr, calculate_portfolio_xirr, build_timeline
)
from app.services.overlap import build_overlap_matrix
from app.services.benchmark import get_nifty50_xirr
from app.services.health_score import calculate_health_score
from app.services.expense import calculate_expense_drag
from app.services.ai_agent import generate_recommendations
from app.utils.amfi import (
    get_nav_by_isin, classify_fund_category, is_direct_plan,
    get_typical_expense_ratio
)
from pydantic import BaseModel

router = APIRouter()

class AnalyzeRequest(BaseModel):
    session_id: str

@router.post("/analyze")
async def analyze_portfolio(request: AnalyzeRequest):
    """
    Main analysis orchestrator.
    Returns complete PortfolioAnalysis JSON.
    """
    session = session_store.get(request.session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found. Please re-upload your statement."
        )
    
    file_bytes = session["file_bytes"]
    language = session.get("language", "en")
    investor_name = session.get("investor_name")
    
    # Step 1: Parse PDF
    try:
        raw_holdings, stmt_type = await parse_statement(
            file_bytes, session["filename"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Could not parse your statement: {str(e)}"
        )
    
    if not raw_holdings:
        raise HTTPException(
            status_code=422,
            detail=f"No valid fund transactions found in '{session['filename']}'. Check if this is a CAMS/KFintech CAS statement and not just a summary."
        )
    
    today = date.today()
    funds_data = []
    all_transactions_combined = []
    
    # Step 2: Enrichment
    for holding in raw_holdings:
        isin = holding.get("isin", "")
        fund_name = holding["fund_name"]
        transactions = holding["transactions"]
        
        # Current NAV
        current_nav = get_nav_by_isin(isin) if isin else None
        if not current_nav:
            # Fallback
            current_nav = transactions[-1].nav if transactions else 1.0
        
        total_units = holding["total_units"]
        current_value = current_nav * total_units
        invested = sum(abs(t.amount) for t in transactions if t.amount < 0)
        
        # Meta info
        category = classify_fund_category(fund_name)
        is_direct = is_direct_plan(fund_name)
        expense_ratio = get_typical_expense_ratio(category, is_direct)
        
        # Fund XIRR
        fund_xirr = calculate_fund_xirr(
            transactions, current_nav, total_units, today
        )
        
        fund_dict = {
            "fund_name": fund_name,
            "isin": isin,
            "scheme_code": None,
            "category": category,
            "amc": fund_name.split()[0] if fund_name else "Unknown",
            "transactions": transactions,
            "current_nav": current_nav,
            "total_units": total_units,
            "current_value": current_value,
            "invested_amount": invested,
            "xirr": fund_xirr,
            "expense_ratio": expense_ratio,
            "is_direct_plan": is_direct,
        }
        funds_data.append(fund_dict)
        for t in transactions:
            d = t.date
            if isinstance(d, str):
                d = datetime.strptime(d, "%Y-%m-%d").date()
            all_transactions_combined.append((d, t.amount))
    
    # Step 3: Global Metrics
    total_invested = sum(f["invested_amount"] for f in funds_data)
    total_value = sum(f["current_value"] for f in funds_data)
    portfolio_xirr = calculate_portfolio_xirr(
        all_transactions_combined, total_value, today
    )
    
    # earliest date for benchmark start
    earliest_date = min(cf[0] for cf in all_transactions_combined)
    benchmark_xirr = await get_nifty50_xirr(earliest_date, today)
    
    # Analysis modules
    overlap_pairs = build_overlap_matrix(funds_data)
    
    weighted_er = sum(
        f["expense_ratio"] * f["current_value"] for f in funds_data
    ) / total_value if total_value > 0 else 0.018
    
    expense = calculate_expense_drag(total_value, weighted_er, portfolio_xirr)
    
    # Health and consistency
    categories_dict = {f["category"]: f["current_value"] for f in funds_data}
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
        categories=categories_dict,
    )
    
    # Timeline for charting
    timeline = build_timeline(all_transactions_combined, total_value, today)
    
    # AI recommendations
    ai_input = {
        "total_invested": total_invested,
        "total_current_value": total_value,
        "portfolio_xirr": portfolio_xirr,
        "benchmark_xirr": benchmark_xirr,
        "health_score": health["total_score"],
        "funds": funds_data,
        "overlap_pairs": overlap_pairs,
        "weighted_expense_ratio": weighted_er,
        "ten_year_drag": expense["ten_year_drag_rupees"],
    }
    ai_results = await generate_recommendations(ai_input, language)
    
    # Cat breakdown
    cat_breakdown = {}
    for f in funds_data:
        cat = f["category"]
        pct = (f["current_value"] / total_value * 100) if total_value > 0 else 0
        cat_breakdown[cat] = round(cat_breakdown.get(cat, 0) + pct, 1)
    
    return {
        "session_id": request.session_id,
        "investor_name": investor_name,
        "language": language,
        "total_invested": round(total_invested, 2),
        "total_current_value": round(total_value, 2),
        "total_xirr": round(portfolio_xirr, 6),
        "funds": [{**f, "transactions": [dict(t) for t in f["transactions"]]} for f in funds_data],
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
        "ai_recommendations": ai_results.get("recommendations", []),
        "timeline": timeline,
        "fund_categories_breakdown": cat_breakdown,
        "analysis_timestamp": str(today),
    }
