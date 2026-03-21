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
