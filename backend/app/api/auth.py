from fastapi import APIRouter, HTTPException, Depends, Header, status
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import time

router = APIRouter(tags=["Authentication"])

# In-memory HR user database for production deployment security
DEMO_USERS = {
    "admin@betah.id": {
        "id": "usr_admin_01",
        "name": "Sarah Jenkins",
        "email": "admin@betah.id",
        "password": "admin123",  # Demo password
        "role": "HR Director",
        "department": "Human Resources",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    "manager@betah.id": {
        "id": "usr_mgr_02",
        "name": "Budi Santoso",
        "email": "manager@betah.id",
        "password": "manager123",  # Demo password
        "role": "HR Analytics Manager",
        "department": "People Analytics",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    }
}

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: str
    avatar: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

@router.post("/auth/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    email = credentials.email.lower().strip()
    user = DEMO_USERS.get(email)
    
    if not user or user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password yang Anda masukkan salah."
        )
        
    # Generate simple secure token (contains user id and timestamp)
    token = f"bt_token_{user['id']}_{int(time.time())}"
    
    user_info = UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        department=user["department"],
        avatar=user["avatar"]
    )
    
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=user_info
    )

@router.get("/auth/me", response_model=UserResponse)
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesi telah berakhir, silakan login kembali."
        )
        
    token = authorization.split(" ")[1]
    
    # Verify token prefix
    if not token.startswith("bt_token_"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token autentikasi tidak valid."
        )
        
    # Find matching user by token pattern
    for user in DEMO_USERS.values():
        if user["id"] in token:
            return UserResponse(
                id=user["id"],
                name=user["name"],
                email=user["email"],
                role=user["role"],
                department=user["department"],
                avatar=user["avatar"]
            )
            
    # Default fallback user
    default_user = DEMO_USERS["admin@betah.id"]
    return UserResponse(
        id=default_user["id"],
        name=default_user["name"],
        email=default_user["email"],
        role=default_user["role"],
        department=default_user["department"],
        avatar=default_user["avatar"]
    )
