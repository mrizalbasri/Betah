from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.employees import router as employees_router
from app.api.predict import router as predict_router
from app.api.chat import router as chat_router
from app.api.analytics import router as analytics_router
from app.api.retrain import router as retrain_router
from app.api.auth import router as auth_router
from app.rag.ingest import ingest_hr_policies
from app.rag.vectorstore import get_chroma_collection

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-ingest RAG HR Policies pada startup jika collection belum terisi
    try:
        collection = get_chroma_collection()
        count = collection.count()
        if count == 0:
            print("[*] RAG Vectorstore kosong. Menjalankan auto-ingest HR policy documents...")
            ingest_hr_policies()
        else:
            print(f"[+] RAG Vectorstore aktif dengan {count} chunk dokumen HR policy.")
    except Exception as e:
        print(f"[!] Warning saat auto-ingest RAG startup: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set CORS middleware with strict allowed methods and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With"],
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(employees_router, prefix=settings.API_V1_STR)
app.include_router(predict_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(retrain_router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}
