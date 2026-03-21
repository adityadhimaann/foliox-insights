from fastapi import APIRouter, Depends, HTTPException, status
from app.database import mongo_db
from app.models.user import UserCreate, UserInDB
from app.utils.auth import get_password_hash, verify_password, create_access_token
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter()

# Schema definitions
class UserSignupResponse(BaseModel):
    id: str
    username: str
    email: str
    message: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup", response_model=UserSignupResponse)
async def signup(user_in: UserCreate):
    """User registration via MongoDB"""
    # Check if user with email already exists in users collection
    existing_user = await mongo_db.users.find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Check if username already exists
    existing_username = await mongo_db.users.find_one({"username": user_in.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="User with this username already exists")
    
    # Create User DB model
    new_user_db = {
        "id": str(uuid.uuid4()),
        "username": user_in.username,
        "email": user_in.email,
        "hashed_password": get_password_hash(user_in.password),
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    
    # Insert into Mongo
    await mongo_db.users.insert_one(new_user_db)
    
    return {
        "id": new_user_db["id"],
        "username": new_user_db["username"],
        "email": new_user_db["email"],
        "message": "User registered successfully in MongoDB!"
    }

@router.post("/login")
async def login(login_data: UserLoginRequest):
    """User authentication via MongoDB and JWT issuance"""
    # Find user in Mongo
    user = await mongo_db.users.find_one({"email": login_data.email})
    
    if not user or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Issue JWT Token
    access_token = create_access_token(data={"sub": user["email"]})
    
    # Mongo activity log
    await mongo_db.activity_logs.insert_one({
        "user_id": user["id"],
        "action": "login",
        "timestamp": datetime.utcnow()
    })
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "email": user["email"], 
            "username": user["username"]
        }
    }
