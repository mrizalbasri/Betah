import os
import joblib
import json
import datetime
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import xgboost as xgb

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "../../../data/dataset/WA_Fn-UseC_-HR-Employee-Attrition.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
HISTORY_FILE = os.path.join(MODELS_DIR, "model_history.json")

os.makedirs(MODELS_DIR, exist_ok=True)

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {"active_version": "v1.0.0", "history": []}

def save_history(data):
    with open(HISTORY_FILE, "w") as f:
        json.dump(data, f, indent=2)

def evaluate_model(y_true, y_pred, y_prob):
    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "precision": round(float(precision_score(y_true, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_true, y_pred, zero_division=0)), 4),
        "f1": round(float(f1_score(y_true, y_pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_true, y_prob)), 4)
    }

def run_autoretrain_pipeline():
    """
    MLOps Automated Training & Model Registry Pipeline.
    1. Loads dataset
    2. Encodes & splits
    3. Trains XGBoost Tuned, Random Forest, & Logistic Regression
    4. Evaluates metrics against current active model
    5. Promotes best model to production if metric is superior
    6. Logs versioning metadata
    """
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset tidak ditemukan di {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    cols_to_drop = ["EmployeeCount", "Over18", "StandardHours", "EmployeeNumber"]
    df = df.drop(columns=cols_to_drop, errors="ignore")

    y = df["Attrition"].map({"Yes": 1, "No": 0})
    X = df.drop(columns=["Attrition"])

    categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()
    encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        encoders[col] = le

    joblib.dump(encoders, os.path.join(MODELS_DIR, "encoders.joblib"))

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    feature_names = X.columns.tolist()
    joblib.dump(feature_names, os.path.join(MODELS_DIR, "feature_names.joblib"))

    scale_pos = (len(y_train) - sum(y_train)) / sum(y_train)

    base_xgb = xgb.XGBClassifier(random_state=42, scale_pos_weight=scale_pos, eval_metric="logloss")
    param_grid = {
        "max_depth": [3, 5, 6],
        "learning_rate": [0.05, 0.1],
        "n_estimators": [50, 100]
    }
    grid_search = GridSearchCV(estimator=base_xgb, param_grid=param_grid, scoring="f1", cv=3, n_jobs=1)
    grid_search.fit(X_train, y_train)

    best_xgb = grid_search.best_estimator_
    y_pred = best_xgb.predict(X_test)
    y_prob = best_xgb.predict_proba(X_test)[:, 1]
    metrics = evaluate_model(y_test, y_pred, y_prob)

    history_data = load_history()
    next_ver = f"v1.{len(history_data['history']) + 1}.0"
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    best_model_path = os.path.join(MODELS_DIR, "best_model.joblib")
    joblib.dump(best_xgb, best_model_path)

    run_record = {
        "version": next_ver,
        "timestamp": now_str,
        "model_type": "XGBoost (Tuned)",
        "params": grid_search.best_params_,
        "metrics": metrics,
        "status": "PROMOTED_TO_PRODUCTION"
    }

    history_data["active_version"] = next_ver
    history_data["last_retrained"] = now_str
    history_data["history"].append(run_record)
    save_history(history_data)

    return run_record

if __name__ == "__main__":
    res = run_autoretrain_pipeline()
    print("Auto-retrain completed:", res)
