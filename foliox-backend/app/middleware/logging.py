import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from app.utils.logger import get_logger

log = get_logger("http")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Logs every request with timing, status, and a request ID.
    Skips /api/health to avoid log noise.
    """
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if path == "/api/health" or path == "/api/admin/health":
            return await call_next(request)
        
        request_id = str(uuid.uuid4())[:8]
        start = time.perf_counter()
        
        response = await call_next(request)
        
        duration_ms = round((time.perf_counter() - start) * 1000, 1)
        
        log.info(
            "request",
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            status=response.status_code,
            duration_ms=duration_ms,
            ip=request.client.host if request.client else "unknown",
        )
        
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{duration_ms}ms"
        return response
