import os
from pydantic_settings import BaseSettings

def get_default_dataset_path() -> str:
    env_dataset = os.getenv("DATASET_PATH")
    if env_dataset and os.path.exists(env_dataset):
        return env_dataset

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    root_dir = os.path.dirname(base_dir)

    candidates = [
        os.path.join(base_dir, "data", "dataset", "WA_Fn-UseC_-HR-Employee-Attrition.csv"),
        os.path.join(root_dir, "data", "dataset", "WA_Fn-UseC_-HR-Employee-Attrition.csv"),
        os.path.join(os.getcwd(), "data", "dataset", "WA_Fn-UseC_-HR-Employee-Attrition.csv"),
        "/app/data/dataset/WA_Fn-UseC_-HR-Employee-Attrition.csv",
        "/data/dataset/WA_Fn-UseC_-HR-Employee-Attrition.csv",
    ]
    for path in candidates:
        if os.path.exists(path):
            return path
    return candidates[0]

def get_default_cors_origins() -> list[str]:
    allowed = os.getenv("ALLOWED_ORIGINS") or os.getenv("BACKEND_CORS_ORIGINS")
    if allowed:
        raw = allowed.strip()
        if raw == "*":
            return ["*"]
        cleaned = raw.strip("[]").replace('"', "").replace("'", "")
        origins = [o.strip() for o in cleaned.split(",") if o.strip()]
        if "*" in origins or not origins:
            return ["*"]
        return origins
    return ["*"]

class Settings(BaseSettings):
    PROJECT_NAME: str = "Betah — Employee Attrition Advisor"
    API_V1_STR: str = "/api"
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATASET_PATH: str = get_default_dataset_path()
    BACKEND_CORS_ORIGINS: list[str] = get_default_cors_origins()

    class Config:
        case_sensitive = True

settings = Settings()
