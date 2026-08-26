import os
import joblib
import pandas as pd
import numpy as np

# Tentukan path relatif ke folder models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "best_model.joblib")
ENCODERS_PATH = os.path.join(MODELS_DIR, "encoders.joblib")

class AttritionPredictor:
    def __init__(self):
        self.model = None
        self.encoders = None
        self._load_resources()

    def _load_resources(self):
        """Loads the trained model and label encoders."""
        if not os.path.exists(MODEL_PATH) or not os.path.exists(ENCODERS_PATH):
            raise FileNotFoundError(
                f"Model atau encoders tidak ditemukan di {MODELS_DIR}. "
                "Pastikan Anda sudah menjalankan train.py terlebih dahulu."
            )
        self.model = joblib.load(MODEL_PATH)
        self.encoders = joblib.load(ENCODERS_PATH)

    def predict_batch(self, df_raw: "pd.DataFrame") -> list[dict]:
        """
        Batch inference untuk seluruh DataFrame sekaligus.
        Jauh lebih cepat daripada memanggil predict() satu per satu.
        """
        df = df_raw.copy()
        cols_to_drop = ["EmployeeCount", "Over18", "StandardHours", "EmployeeNumber", "Attrition"]
        df = df.drop(columns=cols_to_drop, errors="ignore")

        for col, le in self.encoders.items():
            if col in df.columns:
                # Map out-of-vocabulary values ke kelas pertama
                df[col] = df[col].apply(
                    lambda v: v if v in le.classes_ else le.classes_[0]
                )
                df[col] = le.transform(df[col])

        probs = self.model.predict_proba(df)[:, 1]  # satu kali inference untuk semua baris
        return [
            {
                "attrition_probability": float(p),
                "attrition_risk_percentage": float(round(p * 100, 2)),
                "prediction": "Yes" if p >= 0.5 else "No",
            }
            for p in probs
        ]

    def predict(self, employee_data: dict) -> dict:
        """
        Melakukan prediksi risiko attrition untuk satu data karyawan.
        
        Args:
            employee_data (dict): Data karyawan dengan format key-value sesuai kolom dataset.
            
        Returns:
            dict: Berisi probabilitas attrition (%) dan label prediksi (Yes/No).
        """
        # 1. Ubah ke pandas DataFrame
        df = pd.DataFrame([employee_data])
        
        # 2. Hapus kolom yang tidak digunakan model
        cols_to_drop = ["EmployeeCount", "Over18", "StandardHours", "EmployeeNumber", "Attrition"]
        df = df.drop(columns=cols_to_drop, errors="ignore")
        
        # 3. Lakukan encoding untuk kolom kategorikal
        for col, le in self.encoders.items():
            if col in df.columns:
                val = df[col].iloc[0]
                # Jika nilai input tidak ada di encoder (out of vocabulary), mapping ke kelas pertama
                if val not in le.classes_:
                    print(f"[!] Peringatan: Nilai '{val}' pada kolom '{col}' tidak dikenal, default ke '{le.classes_[0]}'")
                    df[col] = le.transform([le.classes_[0]])
                else:
                    df[col] = le.transform([val])
        
        # 4. Lakukan prediksi probabilitas
        # predict_proba mengembalikan [[prob_stay, prob_leave]]
        prob_leave = self.model.predict_proba(df)[0][1]
        prediction_label = "Yes" if prob_leave >= 0.5 else "No"
        
        return {
            "attrition_probability": float(prob_leave),
            "attrition_risk_percentage": float(round(prob_leave * 100, 2)),
            "prediction": prediction_label
        }

# Singleton instance agar resources tidak perlu di-load berulang kali di FastAPI
predictor = None

def predict_employee_attrition(employee_data: dict) -> dict:
    global predictor
    if predictor is None:
        predictor = AttritionPredictor()
    return predictor.predict(employee_data)

def predict_batch_attrition(df: "pd.DataFrame") -> list[dict]:
    """Batch inference untuk semua karyawan sekaligus."""
    global predictor
    if predictor is None:
        predictor = AttritionPredictor()
    return predictor.predict_batch(df)

if __name__ == "__main__":
    # Test script prediksi dengan satu data dummy (dari dataset IBM HR baris pertama)
    dummy_employee = {
        "Age": 41,
        "BusinessTravel": "Travel_Rarely",
        "DailyRate": 1102,
        "Department": "Sales",
        "DistanceFromHome": 1,
        "Education": 2,
        "EducationField": "Life Sciences",
        "EnvironmentSatisfaction": 2,
        "Gender": "Female",
        "HourlyRate": 94,
        "JobInvolvement": 3,
        "JobLevel": 2,
        "JobRole": "Sales Executive",
        "JobSatisfaction": 4,
        "MaritalStatus": "Single",
        "MonthlyIncome": 5993,
        "MonthlyRate": 19479,
        "NumCompaniesWorked": 8,
        "OverTime": "Yes",
        "PercentSalaryHike": 11,
        "PerformanceRating": 3,
        "RelationshipSatisfaction": 1,
        "StockOptionLevel": 0,
        "TotalWorkingYears": 8,
        "TrainingTimesLastYear": 0,
        "WorkLifeBalance": 1,
        "YearsAtCompany": 6,
        "YearsInCurrentRole": 4,
        "YearsSinceLastPromotion": 0,
        "YearsWithCurrManager": 5
    }
    
    try:
        result = predict_employee_attrition(dummy_employee)
        print("\n[+] Test Prediksi Berhasil!")
        print(f"Probabilitas Resign: {result['attrition_risk_percentage']}%")
        print(f"Rekomendasi Attrition: {result['prediction']}")
    except Exception as e:
        print(f"[-] Test Prediksi Gagal: {e}")
