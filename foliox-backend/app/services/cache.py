import redis.asyncio as aioredis
import json
import pickle
from typing import Any, Optional
from app.config import settings
from app.utils.logger import get_logger

log = get_logger(__name__)

class CacheService:
    """
    Redis-backed cache with in-memory fallback.
    Optimised for Phase 2: handles JSON data, binary PDF files, 
    and AMFI cache with individual TTLs.
    """
    
    _redis: Optional[aioredis.Redis] = None
    _fallback: dict = {}   # in-memory dictionary for fallback (single worker only)
    _available: bool = False
    
    @classmethod
    async def connect(cls):
        """Called at startup (lifespan). Tries Redis, falls back silently."""
        try:
            cls._redis = aioredis.from_url(
                settings.REDIS_URL,
                password=settings.REDIS_PASSWORD or None,
                decode_responses=False, # We want raw bytes for binary data
                socket_connect_timeout=2,
                socket_timeout=2,
            )
            await cls._redis.ping()
            cls._available = True
            log.info("redis_connected", url=settings.REDIS_URL)
        except Exception as e:
            cls._available = False
            log.warning("redis_unavailable", error=str(e), fallback="in-memory dict")
    
    @classmethod
    async def disconnect(cls):
        if cls._redis:
            await cls._redis.aclose()
    
    # -- JSON Helpers --
    @classmethod
    async def _set_json(cls, key: str, data: Any, ttl: int):
        payload = json.dumps(data, default=str).encode("utf-8")
        if cls._available:
            try:
                await cls._redis.setex(key, ttl, payload)
                return
            except Exception as e:
                log.error("redis_set_json_failed", key=key, error=str(e))
        
        cls._fallback[key] = {"data": data, "expires": 0} # simplified
    
    @classmethod
    async def _get_json(cls, key: str) -> Optional[Any]:
        if cls._available:
            try:
                raw = await cls._redis.get(key)
                if raw:
                    return json.loads(raw.decode("utf-8"))
                return None
            except Exception as e:
                log.error("redis_get_json_failed", key=key, error=str(e))
        
        entry = cls._fallback.get(key)
        return entry["data"] if entry else None

    # -- Session Management --
    @classmethod
    async def set_session(cls, session_id: str, data: dict, ttl: int = 3600):
        await cls._set_json(f"session:{session_id}", data, ttl)
    
    @classmethod
    async def get_session(cls, session_id: str) -> Optional[dict]:
        return await cls._get_json(f"session:{session_id}")
    
    @classmethod
    async def update_session(cls, session_id: str, updates: dict):
        session = await cls.get_session(session_id) or {}
        session.update(updates)
        await cls.set_session(session_id, session)

    # -- Binary File storage (PDF bytes) --
    @classmethod
    async def store_file(cls, session_id: str, file_bytes: bytes, ttl: int = 1800):
        key = f"file:{session_id}"
        if cls._available:
            try:
                await cls._redis.setex(key, ttl, file_bytes)
                log.info("file_cached_redis", session_id=session_id, size=len(file_bytes))
                return
            except Exception as e:
                log.error("redis_store_file_failed", error=str(e))
        
        cls._fallback[key] = {"data": file_bytes}
        log.info("file_cached_fallback", session_id=session_id)
    
    @classmethod
    async def get_file(cls, session_id: str) -> Optional[bytes]:
        key = f"file:{session_id}"
        if cls._available:
            try:
                raw = await cls._redis.get(key)
                if raw: return raw
            except Exception:
                pass
        
        entry = cls._fallback.get(key)
        if entry: return entry["data"]
        return None

    @classmethod
    async def delete_file(cls, session_id: str):
        key = f"file:{session_id}"
        if cls._available:
            try: await cls._redis.delete(key)
            except: pass
        cls._fallback.pop(key, None)

    # -- Analysis Data (result) --
    @classmethod
    async def cache_analysis(cls, session_id: str, result: dict, ttl: int = 7200):
        await cls._set_json(f"analysis:{session_id}", result, ttl)
    
    @classmethod
    async def get_analysis(cls, session_id: str) -> Optional[dict]:
        return await cls._get_json(f"analysis:{session_id}")

    # -- AMFI Data (Pickle) --
    @classmethod
    async def cache_amfi_data(cls, data: dict, ttl_hours: int = 24):
        key = "amfi:nav_all"
        payload = pickle.dumps(data)
        if cls._available:
            try:
                await cls._redis.setex(key, ttl_hours * 3600, payload)
                return
            except Exception: pass
        cls._fallback[key] = {"data": data}
        
    @classmethod
    async def get_amfi_cache(cls) -> Optional[dict]:
        key = "amfi:nav_all"
        if cls._available:
            try:
                raw = await cls._redis.get(key)
                if raw: return pickle.loads(raw)
            except Exception: pass
        entry = cls._fallback.get(key)
        return entry["data"] if entry else None

cache = CacheService()
