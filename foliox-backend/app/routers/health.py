from fastapi import APIRouter
from app.utils.amfi import _amfi_cache

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "amfi_funds_loaded": len(_amfi_cache),
        "version": "1.0.0",
    }
