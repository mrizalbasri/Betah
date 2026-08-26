import os
import time
import psycopg2
import jwt
from typing import Optional, Dict, Any
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Depends, Header, status
from pydantic import BaseModel, EmailStr

router = APIRouter(tags=["Authentication"])

# JWT Configuration — ponytail: use fallback secret for dev, override with JWT_SECRET env in prod
JWT_SECRET = os.getenv("JWT_SECRET", "betah_sec_key_production_2026_super_secret_hr_8849")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# In-memory HR user database for production deployment security & fallback
DEMO_USERS = {
    "admin@betah.id": {
        "id": "usr_admin_01",
        "name": "Sarah Jenkins",
        "email": "admin@betah.id",
        "password": "admin123",
        "role": "HR Director",
        "department": "Human Resources",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    "manager@betah.id": {
        "id": "usr_mgr_02",
        "name": "Budi Santoso",
        "email": "manager@betah.id",
        "password": "manager123",
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

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_user_from_db_or_demo(email: str) -> Optional[Dict[str, Any]]:
    db_url = os.getenv("DATABASE_URL")
    if db_url and "neon.tech" in db_url:
        try:
            conn = psycopg2.connect(db_url)
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, email, password, role, department, avatar FROM users WHERE email = %s;", (email,))
            row = cursor.fetchone()
            cursor.close()
            conn.close()
            if row:
                return {
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "password": row[3],
                    "role": row[4],
                    "department": row[5],
                    "avatar": row[6] or ""
                }
        except Exception as e:
            print(f"[!] Warning: Query Neon DB error ({e}), fallback ke DEMO_USERS")
    
    return DEMO_USERS.get(email)

async def get_current_user(authorization: Optional[str] = Header(None)) -> UserResponse:
    """
    FastAPI Security Dependency — decodes and verifies JWT bearer tokens.
    Returns 401 UNAUTHORIZED if invalid or expired. NO FALLBACK BYPASS.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesi telah berakhir atau header autentikasi tidak ditemukan. Silakan login kembali."
        )
        
    token = authorization.split(" ")[1]
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token tidak valid.")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sesi telah kadaluwarsa, silakan login kembali.")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token autentikasi tidak valid.")
        
    user = get_user_from_db_or_demo(email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Pengguna tidak ditemukan.")

    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        department=user["department"],
        avatar=user["avatar"]
    )

@router.post("/auth/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    email = credentials.email.lower().strip()
    user = get_user_from_db_or_demo(email)
    
    if not user or user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password yang Anda masukkan salah."
        )
        
    token = create_access_token(data={"sub": user["email"], "user_id": user["id"], "role": user["role"]})
    
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
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

