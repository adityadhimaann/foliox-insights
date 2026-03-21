from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

# 🍃 MongoDB Connection
mongo_client = AsyncIOMotorClient(settings.MONGODB_URL)
mongo_db = mongo_client[settings.MONGODB_DB_NAME]

async def init_db():
    """Initialize MongoDB indexes"""
    try:
        # Create unique index for users collection
        await mongo_db.users.create_index("email", unique=True)
        await mongo_db.users.create_index("username", unique=True)
        logging.info("MongoDB Indexes created successfully.")
    except Exception as e:
        logging.error(f"Error initializing MongoDB Indexes: {e}")

def get_mongo_db():
    """Dependency for getting MongoDB"""
    return mongo_db
