import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import xgboost as xgb
import mlflow
import mlflow.sklearn
import mlflow.xgboost

# Tentukan path relatif
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "../../../data/dataset/WA_Fn-UseC_-HR-Employee-Attrition.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Buat folder models jika belum ada
os.makedirs(MODELS_DIR, exist_ok=True)

def load_and_preprocess_data():
    """
    Membaca dataset, membuang fitur konstan, melakukan encoding, 
    dan memisahkan fitur dengan target.
    """
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset tidak ditemukan di {DATASET_PATH}")
        
    df = pd.read_csv(DATASET_PATH)
    
    # 1. Drop kolom yang tidak informatif atau konstan
    cols_to_drop = ["EmployeeCount", "Over18", "StandardHours", "EmployeeNumber"]
    df = df.drop(columns=cols_to_drop, errors="ignore")
    
    # 2. Map target 'Attrition' (Yes -> 1, No -> 0)
    y = df["Attrition"].map({"Yes": 1, "No": 0})
    X = df.drop(columns=["Attrition"])
    
    # 3. Label Encoding untuk kolom kategorikal (object)
    categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()
    encoders = {}
    
    for col in categorical_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        encoders[col] = le
        
    # Simpan encoders agar bisa digunakan saat inference
    encoder_path = os.path.join(MODELS_DIR, "encoders.joblib")
    joblib.dump(encoders, encoder_path)
    print(f"[*] Label Encoders berhasil disimpan di: {encoder_path}")
    
    return X, y

def evaluate_model(y_true, y_pred, y_prob):
    """
    Menghitung metrik evaluasi model klasifikasi.
    """
    metrics = {
        "accuracy": accuracy_score(y_true, y_pred),
        "precision": precision_score(y_true, y_pred, zero_division=0),
        "recall": recall_score(y_true, y_pred, zero_division=0),
        "f1": f1_score(y_true, y_pred, zero_division=0),
        "roc_auc": roc_auc_score(y_true, y_prob)
    }
    return metrics

def train_pipeline():
    # 1. Load & Preprocess Data
    X, y = load_and_preprocess_data()
    
    # 2. Split Data (Stratified Split karena data imbalanced)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Simpan list fitur untuk kebutuhan interpretasi SHAP nanti
    feature_names = X.columns.tolist()
    joblib.dump(feature_names, os.path.join(MODELS_DIR, "feature_names.joblib"))
    
    # 3. Set MLflow Experiment
    mlflow.set_tracking_uri("sqlite:///mlflow.db")
    mlflow.set_experiment("employee_attrition_experiments")
    
    best_f1 = 0
    best_model = None
    best_model_name = ""
    
    # --- RUN 1: LOGISTIC REGRESSION (BASELINE) ---
    with mlflow.start_run(run_name="Logistic_Regression_Baseline"):
        print("\n[*] Training Logistic Regression Baseline...")
        lr = LogisticRegression(max_iter=1000, random_state=42)
        lr.fit(X_train, y_train)
        
        y_pred = lr.predict(X_test)
        y_prob = lr.predict_proba(X_test)[:, 1]
        
        metrics = evaluate_model(y_test, y_pred, y_prob)
        
        # Log parameter & metrics ke MLflow
        mlflow.log_params(lr.get_params())
        mlflow.log_metrics(metrics)
        mlflow.sklearn.log_model(lr, "model")
        
        print(f"Logistic Regression -> F1: {metrics['f1']:.4f} | ROC-AUC: {metrics['roc_auc']:.4f}")
        
        if metrics["f1"] > best_f1:
            best_f1 = metrics["f1"]
            best_model = lr
            best_model_name = "LogisticRegression"
            
    # --- RUN 2: RANDOM FOREST ---
    with mlflow.start_run(run_name="Random_Forest"):
        print("\n[*] Training Random Forest...")
        rf = RandomForestClassifier(n_estimators=100, random_state=42, class_weight="balanced")
        rf.fit(X_train, y_train)
        
        y_pred = rf.predict(X_test)
        y_prob = rf.predict_proba(X_test)[:, 1]
        
        metrics = evaluate_model(y_test, y_pred, y_prob)
        
        mlflow.log_params(rf.get_params())
        mlflow.log_metrics(metrics)
        mlflow.sklearn.log_model(rf, "model")
        
        print(f"Random Forest -> F1: {metrics['f1']:.4f} | ROC-AUC: {metrics['roc_auc']:.4f}")
        
        if metrics["f1"] > best_f1:
            best_f1 = metrics["f1"]
            best_model = rf
            best_model_name = "RandomForest"
            
    # --- RUN 3: XGBOOST CLASSFIER ---
    with mlflow.start_run(run_name="XGBoost_Default"):
        print("\n[*] Training XGBoost (Default)...")
        # Mengatur scale_pos_weight untuk mengatasi imbalance data (ratio negative/positive class)
        scale_pos = (len(y_train) - sum(y_train)) / sum(y_train)
        xgb_model = xgb.XGBClassifier(random_state=42, scale_pos_weight=scale_pos, eval_metric="logloss")
        xgb_model.fit(X_train, y_train)
        
        y_pred = xgb_model.predict(X_test)
        y_prob = xgb_model.predict_proba(X_test)[:, 1]
        
        metrics = evaluate_model(y_test, y_pred, y_prob)
        
        # XGBoost get_params bisa mengembalikan tipe non-primitif, ambil config dasar
        params = xgb_model.get_params()
        mlflow.log_params({k: str(v) for k, v in params.items()})
        mlflow.log_metrics(metrics)
        mlflow.xgboost.log_model(xgb_model, "model")
        
        print(f"XGBoost Default -> F1: {metrics['f1']:.4f} | ROC-AUC: {metrics['roc_auc']:.4f}")
        
        if metrics["f1"] > best_f1:
            best_f1 = metrics["f1"]
            best_model = xgb_model
            best_model_name = "XGBoost"

    # --- RUN 4: XGBOOST + TUNING ---
    with mlflow.start_run(run_name="XGBoost_Tuned"):
        print("\n[*] Tuning XGBoost Hyperparameters...")
        scale_pos = (len(y_train) - sum(y_train)) / sum(y_train)
        
        base_xgb = xgb.XGBClassifier(random_state=42, scale_pos_weight=scale_pos, eval_metric="logloss")
        
        param_grid = {
            "max_depth": [3, 5, 7],
            "learning_rate": [0.01, 0.1, 0.2],
            "n_estimators": [50, 100, 150]
        }
        
        # Tuning menggunakan GridSearchCV dengan metrik F1-score
        grid_search = GridSearchCV(
            estimator=base_xgb,
            param_grid=param_grid,
            scoring="f1",
            cv=3,
            n_jobs=1
        )

        grid_search.fit(X_train, y_train)
        
        best_xgb = grid_search.best_estimator_
        
        y_pred = best_xgb.predict(X_test)
        y_prob = best_xgb.predict_proba(X_test)[:, 1]
        
        metrics = evaluate_model(y_test, y_pred, y_prob)
        
        # Log best parameters & metrics ke MLflow
        mlflow.log_params(grid_search.best_params_)
        mlflow.log_metrics(metrics)
        mlflow.xgboost.log_model(best_xgb, "model")
        
        print(f"XGBoost Tuned -> F1: {metrics['f1']:.4f} | ROC-AUC: {metrics['roc_auc']:.4f}")
        print(f"Best Params: {grid_search.best_params_}")
        
        if metrics["f1"] > best_f1:
            best_f1 = metrics["f1"]
            best_model = best_xgb
            best_model_name = "XGBoost_Tuned"
            
    # 5. Simpan model terbaik ke lokal untuk backend inference
    best_model_path = os.path.join(MODELS_DIR, "best_model.joblib")
    joblib.dump(best_model, best_model_path)
    print(f"\n[+] Sukses! Model terbaik adalah {best_model_name} dengan F1-score {best_f1:.4f}")
    print(f"[+] Model terbaik disimpan secara lokal di: {best_model_path}")

if __name__ == "__main__":
    train_pipeline()
