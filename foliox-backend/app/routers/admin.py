from fastapi import APIRouter
from app.services.cache import cache
from app.utils.amfi import _amfi_cache
import psutil, time

router = APIRouter()
START_TIME = time.time()

@router.get("/admin/health")
async def detailed_health():
    """
    Detailed system health for monitoring.
    Shows Redis status, AMFI cache, memory usage.
    """
    process = psutil.Process()
    mem = process.memory_info()
    
    redis_ok = False
    redis_keys = 0
    if cache._available and cache._redis:
        try:
            await cache._redis.ping()
            redis_ok = True
            redis_keys = await cache._redis.dbsize()
        except Exception:
            redis_ok = False
    
    return {
        "status": "ok",
        "uptime_seconds": round(time.time() - START_TIME),
        "redis": {
            "connected": redis_ok,
            "active_keys": redis_keys,
            "fallback_keys": len(cache._fallback),
        },
        "amfi": {
            "funds_loaded": len(_amfi_cache),
            "status": "ok" if _amfi_cache else "empty",
        },
        "memory": {
            "rss_mb": round(mem.rss / 1024 / 1024, 1),
            "vms_mb": round(mem.vms / 1024 / 1024, 1),
        },
        "version": "2.0.0",
    }
