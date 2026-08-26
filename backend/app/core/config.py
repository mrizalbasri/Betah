import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Betah — Employee Attrition Advisor"
    API_V1_STR: str = "/api"
    
    # Path Data (4 levels up: config.py -> core -> app -> backend -> root)
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    DATASET_PATH: str = os.path.join(BASE_DIR, "data", "dataset", "WA_Fn-UseC_-HR-Employee-Attrition.csv")
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "*",
    ]

    def __init__(self, **values):
        super().__init__(**values)
        allowed = os.getenv("ALLOWED_ORIGINS") or os.getenv("BACKEND_CORS_ORIGINS")
        if allowed:
            if allowed.strip() == "*":
                self.BACKEND_CORS_ORIGINS = ["*"]
            else:
                self.BACKEND_CORS_ORIGINS = [origin.strip() for origin in allowed.split(",") if origin.strip()]

    class Config:
        case_sensitive = True

settings = Settings()
