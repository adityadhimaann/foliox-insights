from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Request
from typing import Optional
import uuid
from app.services.cache import cache
from app.services.validator import validate_pdf_content
from app.middleware.rate_limit import limiter
from app.utils.logger import get_logger

log = get_logger(__name__)
router = APIRouter()

@router.post("/upload")
@limiter.limit("20/hour")
async def upload_statement(
    request: Request,
    file: UploadFile = File(...),
    name: Optional[str] = Form(None),
    language: str = Form("en"),
):
    """
    Accept PDF upload, validate content, and return session_id.
    """
    # 1. Basic file type check
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted. Please export your CAMS or KFintech statement as PDF."
        )
    
    # 2. Read and Size check
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > 15:
        raise HTTPException(
            status_code=413,
            detail=f"File size {size_mb:.1f}MB exceeds 15MB limit. Please use a shorter date range."
        )
    
    # 3. Deep Content Validation (PDF validity, Fingerprinting, Transcription checking)
    is_valid, error_msg = validate_pdf_content(contents)
    if not is_valid:
        log.warning("upload_validation_failed", filename=file.filename, error=error_msg)
        raise HTTPException(status_code=422, detail=error_msg)
    
    # 4. Generate Session
    session_id = str(uuid.uuid4())
    
    # 5. Store in Cache (Redis)
    # Store essential metadata in session
    await cache.set_session(session_id, {
        "filename": file.filename,
        "investor_name": name,
        "language": language,
        "status": "uploaded",
        "upload_time": str(uuid.uuid4()), # uniqueness marker
    })
    
    # Store binary file bytes separately with a shorter TTL (15 mins)
    await cache.store_file(session_id, contents, ttl=900)
    
    log.info("statement_uploaded", session_id=session_id, 
             filename=file.filename, size_mb=round(size_mb, 2))
    
    return {
        "session_id": session_id,
        "filename": file.filename,
        "size_mb": round(size_mb, 2),
        "message": "File validated and uploaded successfully. Starting analysis..."
    }
