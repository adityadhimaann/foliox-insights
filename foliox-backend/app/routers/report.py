from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from app.services.cache import cache
from app.services.report_gen import generate_pdf_report
from app.utils.logger import get_logger

log = get_logger(__name__)
router = APIRouter()

@router.get("/report/{session_id}")
async def download_report(session_id: str):
    """
    Generate and stream the PDF report for a completed analysis.
    Called when user clicks "Download Report" on results page.
    """
    analysis = await cache.get_analysis(session_id)
    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found or expired. Please re-run the analysis."
        )
    
    try:
        pdf_bytes = await generate_pdf_report(analysis)
    except Exception as e:
        log.error("report_gen_failed", session_id=session_id, error=str(e))
        raise HTTPException(
            status_code=500,
            detail="Could not generate report. Please try again."
        )
    
    investor = analysis.get("investor_name") or "Portfolio"
    filename = f"FolioX_{investor.replace(' ','_')}_Report.pdf"
    
    log.info("report_downloaded", session_id=session_id, size_kb=len(pdf_bytes)//1024)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
            "Cache-Control": "no-cache",
        }
    )

from fastapi import Request

@router.post("/report/generate-custom")
async def generate_custom_report(request: Request):
    """
    Generate PDF from frontend-supplied JSON layout. Used for demo modes.
    """
    try:
        analysis = await request.json()
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
        
    # Map frontend keys to what reportlab generator expects
    # Handle both real analysis results and mock demo data
    if 'total_investment' in analysis and 'total_invested' not in analysis:
        analysis['total_invested'] = analysis['total_investment']
    
    # Ensure other top-level metrics are present
    analysis.setdefault('total_current_value', analysis.get('total_value', 0))
    analysis.setdefault('total_xirr', analysis.get('portfolio_xirr', 0))
    
    for f in analysis.get('funds', []):
        if 'investment_value' in f and 'invested_amount' not in f:
            f['invested_amount'] = f['investment_value']
        # Ensure xirr and current_value are present for the generator
        f.setdefault('xirr', 0.0)
        f.setdefault('current_value', 0.0)
        f.setdefault('invested_amount', 0.0)
            
    try:
        pdf_bytes = await generate_pdf_report(analysis)
    except Exception as e:
        log.error("custom_report_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Report generation failed")
    
    investor = analysis.get("investor_name") or "Aditya_Kumar"
    filename = f"FolioX_{investor.replace(' ','_')}_Analysis.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )
