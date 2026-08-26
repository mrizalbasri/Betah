import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Betah — Employee Attrition Advisor"
    API_V1_STR: str = "/api"
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATASET_PATH: str = ""

    def __init__(self, **values):
        super().__init__(**values)
        env_dataset = os.getenv("DATASET_PATH")
        if env_dataset and os.path.exists(env_dataset):
            self.DATASET_PATH = env_dataset
        else:
            candidates = [
                os.path.join(self.BASE_DIR, "data", "dataset", "WA_Fn-UseC_-HR-Employee-Attrition.csv"),
                os.path.join(os.path.dirname(self.BASE_DIR), "data", "dataset", "WA_Fn-UseC_-HR-Employee-Attrition.csv"),
                os.path.join(os.getcwd(), "data", "dataset", "WA_Fn-UseC_-HR-Employee-Attrition.csv"),
                "/app/data/dataset/WA_Fn-UseC_-HR-Employee-Attrition.csv",
                "/data/dataset/WA_Fn-UseC_-HR-Employee-Attrition.csv",
            ]
            for path in candidates:
                if os.path.exists(path):
                    self.DATASET_PATH = path
                    break
            if not self.DATASET_PATH:
                self.DATASET_PATH = candidates[0]
    
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
