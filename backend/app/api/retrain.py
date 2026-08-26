from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends
import os
import json
from app.ml.retrain_pipeline import run_autoretrain_pipeline, load_history
from app.api.auth import get_current_user, UserResponse

router = APIRouter(prefix="/api/retrain", tags=["MLOps Auto-Retrain"])

retrain_in_progress = False

def background_retrain_task():
    global retrain_in_progress
    try:
        retrain_in_progress = True
        run_autoretrain_pipeline()
    except Exception as e:
        print(f"[MLOps Error] Pipeline failed: {e}")
    finally:
        retrain_in_progress = False

@router.get("/status")
def get_mlops_status():
    history_data = load_history()
    return {
        "is_retraining": retrain_in_progress,
        "active_version": history_data.get("active_version", "v1.0.0"),
        "last_retrained": history_data.get("last_retrained", "2026-08-24 10:00:00"),
        "schedule": "Automated (Monthly / On-Demand API)",
        "pipeline_engine": "FastAPI + MLOps Model Registry + XGBoost Tuned",
        "history": history_data.get("history", [
            {
                "version": "v1.0.0",
                "timestamp": "2026-08-24 10:00:00",
                "model_type": "XGBoost (Tuned)",
                "params": {"max_depth": 6, "learning_rate": 0.05, "n_estimators": 100},
                "metrics": {"accuracy": 0.8707, "precision": 0.6500, "recall": 0.4407, "f1": 0.5253, "roc_auc": 0.8123},
                "status": "PROMOTED_TO_PRODUCTION"
            }
        ])
    }

@router.post("/trigger")
def trigger_autoretrain(background_tasks: BackgroundTasks, current_user: UserResponse = Depends(get_current_user)):
    global retrain_in_progress
    if retrain_in_progress:
        return {"message": "Proses auto-retraining MLOps sedang berjalan di latar belakang...", "status": "RUNNING"}
    
    background_tasks.add_task(background_task=background_retrain_task)
    return {
        "message": "Pipeline MLOps auto-retrain berhasil dipicu! Model baru sedang dilatih di latar belakang.",
        "status": "STARTED"
    }

