import os
import joblib
import pandas as pd
import numpy as np
import shap

# Tentukan path relatif ke folder models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "best_model.joblib")
ENCODERS_PATH = os.path.join(MODELS_DIR, "encoders.joblib")
FEATURE_NAMES_PATH = os.path.join(MODELS_DIR, "feature_names.joblib")

# Mapping nama kolom database ke nama tampilan yang ramah pengguna (human-readable)
DISPLAY_NAME_MAP = {
    "Age": "Usia",
    "BusinessTravel": "Frekuensi Perjalanan Dinas",
    "DailyRate": "Tarif Harian",
    "Department": "Departemen",
    "DistanceFromHome": "Jarak dari Rumah (km)",
    "Education": "Tingkat Pendidikan",
    "EducationField": "Bidang Pendidikan",
    "EnvironmentSatisfaction": "Kepuasan Lingkungan Kerja",
    "Gender": "Jenis Kelamin",
    "HourlyRate": "Tarif Per Jam",
    "JobInvolvement": "Keterlibatan Kerja",
    "JobLevel": "Level Jabatan",
    "JobRole": "Peran Pekerjaan",
    "JobSatisfaction": "Kepuasan Kerja",
    "MaritalStatus": "Status Pernikahan",
    "MonthlyIncome": "Pendapatan Bulanan",
    "MonthlyRate": "Tarif Bulanan",
    "NumCompaniesWorked": "Jumlah Perusahaan Sebelumnya",
    "OverTime": "Kerja Lembur",
    "PercentSalaryHike": "Persentase Kenaikan Gaji",
    "PerformanceRating": "Rating Kinerja",
    "RelationshipSatisfaction": "Kepuasan Hubungan Kerja",
    "StockOptionLevel": "Level Opsi Saham",
    "TotalWorkingYears": "Total Pengalaman Kerja (Tahun)",
    "TrainingTimesLastYear": "Jumlah Pelatihan Tahun Lalu",
    "WorkLifeBalance": "Keseimbangan Hidup & Kerja (Work-Life Balance)",
    "YearsAtCompany": "Lama Bekerja di Perusahaan (Tahun)",
    "YearsInCurrentRole": "Lama Bekerja di Jabatan Sekarang",
    "YearsSinceLastPromotion": "Tahun Sejak Promosi Terakhir",
    "YearsWithCurrManager": "Lama Bekerja dengan Manajer Saat Ini"
}

class AttritionExplainer:
    def __init__(self):
        self.model = None
        self.encoders = None
        self.feature_names = None
        self.explainer = None
        self._load_resources()

    def _load_resources(self):
        """Memuat model, encoders, feature names, dan menginisialisasi SHAP Explainer."""
        if not all(os.path.exists(p) for p in [MODEL_PATH, ENCODERS_PATH, FEATURE_NAMES_PATH]):
            raise FileNotFoundError(
                "Resource ML (model, encoders, atau feature names) tidak lengkap. "
                "Pastikan Anda telah sukses menjalankan train.py."
            )
        
        self.model = joblib.load(MODEL_PATH)
        self.encoders = joblib.load(ENCODERS_PATH)
        self.feature_names = joblib.load(FEATURE_NAMES_PATH)
        
        # XGBoost Classifier bisa langsung dibaca TreeExplainer
        self.explainer = shap.TreeExplainer(self.model)

    def explain(self, employee_data: dict, top_n: int = 5) -> dict:
        """
        Menghitung SHAP values untuk satu data karyawan untuk melihat faktor dominan.
        
        Args:
            employee_data (dict): Data mentah karyawan.
            top_n (int): Jumlah kontribusi terbesar yang ingin diambil.
            
        Returns:
            dict: Berisi base value model dan daftar kontribusi fitur teratas.
        """
        # 1. Simpan salinan data mentah (string aslinya) untuk dicantumkan di visualisasi
        raw_values = employee_data.copy()
        
        # 2. Ubah ke DataFrame untuk preprocessing
        df = pd.DataFrame([employee_data])
        
        # Hapus kolom yang tidak dipakai model
        cols_to_drop = ["EmployeeCount", "Over18", "StandardHours", "EmployeeNumber", "Attrition"]
        df = df.drop(columns=cols_to_drop, errors="ignore")
        
        # 3. Lakukan encoding
        for col, le in self.encoders.items():
            if col in df.columns:
                val = df[col].iloc[0]
                if val not in le.classes_:
                    df[col] = le.transform([le.classes_[0]])
                else:
                    df[col] = le.transform([val])
                    
        # 4. Urutkan kolom agar persis sama dengan feature_names saat training
        df = df[self.feature_names]
        
        # 5. Hitung nilai SHAP
        # shap_values berupa array berdimensi (n_samples, n_features) atau list of arrays (untuk klasifikasi)
        shap_res = self.explainer(df)
        
        # Mengambil base value dan SHAP values
        # Di versi SHAP baru, shap_res memiliki atribut .base_values dan .values
        base_value = float(shap_res.base_values[0])
        shap_values_raw = shap_res.values[0]
        
        # 6. Bentuk kontribusi fitur
        contributions = []
        for i, col in enumerate(self.feature_names):
            shap_val = float(shap_values_raw[i])
            raw_val = raw_values.get(col, df[col].iloc[0])
            
            contributions.append({
                "feature": col,
                "display_name": DISPLAY_NAME_MAP.get(col, col),
                "shap_value": shap_val,
                "feature_value": raw_val,
                # Tentukan arah dampak
                "impact": "increase" if shap_val > 0 else "decrease",
                "abs_shap_value": abs(shap_val)
            })
            
        # Urutkan berdasarkan nilai absolut SHAP terbesar
        contributions = sorted(contributions, key=lambda x: x["abs_shap_value"], reverse=True)
        
        # Pisahkan faktor pendorong resign (positif) dan penahan resign (negatif)
        increase_factors = [c for c in contributions if c["impact"] == "increase"][:top_n]
        decrease_factors = [c for c in contributions if c["impact"] == "decrease"][:top_n]
        
        return {
            "base_value": base_value,
            "top_increase_factors": increase_factors,
            "top_decrease_factors": decrease_factors,
            "all_contributions": contributions[:top_n*2]
        }

# Singleton instance
explainer_instance = None

def explain_employee_attrition(employee_data: dict, top_n: int = 5) -> dict:
    global explainer_instance
    if explainer_instance is None:
        explainer_instance = AttritionExplainer()
    return explainer_instance.explain(employee_data, top_n)

if __name__ == "__main__":
    # Test script penjelasan dengan satu data dummy yang sama
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
        explanation = explain_employee_attrition(dummy_employee, top_n=3)
        print("\n[+] Test SHAP Explainer Berhasil!")
        
        print("\n=== FAKTOR UTAMA MENINGKATKAN RISIKO RESIGN ===")
        for factor in explanation["top_increase_factors"]:
            print(f"- {factor['display_name']} ({factor['feature_value']}) -> Kontribusi: +{factor['shap_value']:.4f}")
            
        print("\n=== FAKTOR UTAMA MENAHAN KARYAWAN BERTAHAN ===")
        for factor in explanation["top_decrease_factors"]:
            print(f"- {factor['display_name']} ({factor['feature_value']}) -> Kontribusi: {factor['shap_value']:.4f}")
            
    except Exception as e:
        print(f"[-] Test Explainer Gagal: {e}")
