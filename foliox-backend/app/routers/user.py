from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.database import mongo_db
from app.utils.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/user", tags=["user"])

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    user = await mongo_db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "username": user["username"],
        "email": user["email"],
        "is_active": user.get("is_active", True),
        "created_at": user.get("created_at")
    }

@router.get("/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    user = await mongo_db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    cursor = mongo_db.activity_logs.find({"user_id": user["id"]}).sort("timestamp", -1).limit(20)
    logs = await cursor.to_list(length=20)
    
    for log in logs:
        log["id"] = str(log["_id"])
        del log["_id"]
        
    return logs
