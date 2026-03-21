from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from slowapi.errors import RateLimitExceeded

from app.routers import upload, analyze, health, report, stream, admin, auth, user
from app.config import settings
from app.utils.amfi import warm_amfi_cache
from app.utils.logger import setup_logging, get_logger
from app.services.cache import cache
from app.middleware.rate_limit import limiter, rate_limit_exceeded_handler
from app.middleware.logging import RequestLoggingMiddleware
from app.database import init_db

setup_logging()
log = get_logger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("foliox_starting", version="2.5.0")
    # Startup: Initialize MongoDB and Redis
    await init_db()
    await cache.connect()
    # Startup: Warm the AMFI NAV cache
    await warm_amfi_cache()
    log.info("foliox_ready")
    yield
    # Shutdown: Cleanup
    await cache.disconnect()
    log.info("foliox_shutdown")

app = FastAPI(
    title="FolioX API",
    description="AI-powered mutual fund portfolio analyser — Phase 2 Production Hardened",
    version="2.5.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url=None,
)

# Exception handlers and state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# Middlewares (Order matters: Logging should be outer)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Response-Time"],
)

# Health & Core
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(admin.router,  prefix="/api", tags=["admin"])

# User & Auth (Production Authentication)
app.include_router(auth.router,   prefix="/api/auth", tags=["authentication"])
app.include_router(user.router,   prefix="/api/user", tags=["user profile"])

# Analysis Pipeline (Now with Real-time Streaming)
app.include_router(upload.router,  prefix="/api", tags=["upload"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(stream.router,  prefix="/api", tags=["stream analysis"])
app.include_router(report.router,  prefix="/api", tags=["report generation"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
