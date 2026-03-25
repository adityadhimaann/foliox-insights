from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.database import mongo_db
from app.utils.auth import get_current_user
from datetime import datetime

router = APIRouter(tags=["user"])

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

@router.post("/feedback")
async def save_feedback(data: dict, current_user: dict = Depends(get_current_user)):
    user = await mongo_db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    feedback_doc = {
        "user_id": user["id"],
        "email": user["email"],
        "message": data.get("message", ""),
        "rating": data.get("rating", 5),
        "timestamp": datetime.utcnow()
    }
    
    await mongo_db.feedback.insert_one(feedback_doc)
    
    # Log the activity
    await mongo_db.activity_logs.insert_one({
        "user_id": user["id"],
        "action": "provided_feedback",
        "timestamp": datetime.utcnow()
    })
    
    return {"status": "success", "message": "Feedback saved"}

from pydantic import BaseModel
class ActivityData(BaseModel):
    action: str

@router.post("/log-activity")
async def log_activity(data: ActivityData, current_user: dict = Depends(get_current_user)):
    user = await mongo_db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    await mongo_db.activity_logs.insert_one({
        "user_id": user["id"],
        "action": data.action,
        "timestamp": datetime.utcnow()
    })
    return {"status": "success"}
