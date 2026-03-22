from pydantic_settings import BaseSettings
from typing import List, Optional, Union
from pydantic import field_validator
import json

class Settings(BaseSettings):
    ANTHROPIC_API_KEY: str = ""
    ENVIRONMENT: str = "development"
    MAX_FILE_SIZE_MB: int = 10
    
    # Render-friendly origin parsing (handles comma-separated and JSON)
    ALLOWED_ORIGINS: str = "*"
    
    @property
    def cors_origins(self) -> List[str]:
        """Convert the raw string into a clean list for CORSMiddleware."""
        v = self.ALLOWED_ORIGINS.strip()
        if not v or v == "*":
            return ["*"]
        if v.startswith("["):
            try:
                return [str(i) for i in json.loads(v)]
            except:
                return [v]
        return [i.strip() for i in v.split(",") if i.strip()]

    AMFI_CACHE_TTL_HOURS: int = 24
    SESSION_TTL_MINUTES: int = 30
    
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017/"
    MONGODB_DB_NAME: str = "foliox_db"
    
    # Auth
    JWT_SECRET: str = "your_secret_key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24h
    
    # Phase 2 — Redis & Infrastructure
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_PASSWORD: Optional[str] = None
    SESSION_SECRET_KEY: str = "your-32-char-secret-key-here"
    RATE_LIMIT_PER_MINUTE: int = 10
    RATE_LIMIT_UPLOAD_PER_HOUR: int = 20
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"  # "json" or "pretty"
    
    # PDF & Features
    REPORT_LOGO_PATH: str = "assets/foliox_logo.png"
    ENABLE_HINDI: bool = True
    SENTRY_DSN: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
