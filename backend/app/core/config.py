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
    ]

    class Config:
        case_sensitive = True

settings = Settings()
