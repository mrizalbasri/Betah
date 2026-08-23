import os
import pandas as pd
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from app.core.config import settings
from app.ml.predict import predict_employee_attrition
from app.ml.explain import explain_employee_attrition

router = APIRouter(prefix="/employees", tags=["Employees"])

_dataset_cache: Optional[pd.DataFrame] = None
_processed_records: Optional[List[Dict[str, Any]]] = None

def load_employee_data() -> List[Dict[str, Any]]:
    """
    Memuat dataset karyawan dari CSV dan menghitung risk score awal untuk setiap karyawan.
    Menggunakan in-memory caching agar respons cepat.
    """
    global _processed_records
    if _processed_records is not None:
        return _processed_records

    if not os.path.exists(settings.DATASET_PATH):
        raise FileNotFoundError(f"File dataset tidak ditemukan di: {settings.DATASET_PATH}")

    df = pd.read_csv(settings.DATASET_PATH)
    
    if "EmployeeNumber" not in df.columns:
        df["EmployeeNumber"] = range(1, len(df) + 1)
        
    records = []
    for _, row in df.iterrows():
        emp_dict = row.to_dict()
        emp_id = int(emp_dict["EmployeeNumber"])
        
        # Hitung prediksi risiko attrition
        pred_res = predict_employee_attrition(emp_dict)
        
        # Top factor Heuristic/Quick estimation untuk tabel list
        top_factor_name = "Kerja Lembur (OverTime)" if emp_dict.get("OverTime") == "Yes" else f"Masa Kerja: {emp_dict.get('YearsAtCompany', 0)} Tahun"
            
        record = {
            "employee_id": emp_id,
            "EmployeeNumber": emp_id,
            "Age": int(emp_dict.get("Age", 0)),
            "Gender": str(emp_dict.get("Gender", "")),
            "Department": str(emp_dict.get("Department", "")),
            "JobRole": str(emp_dict.get("JobRole", "")),
            "MonthlyIncome": float(emp_dict.get("MonthlyIncome", 0)),
            "OverTime": str(emp_dict.get("OverTime", "")),
            "YearsAtCompany": int(emp_dict.get("YearsAtCompany", 0)),
            "YearsInCurrentRole": int(emp_dict.get("YearsInCurrentRole", 0)),
            "JobSatisfaction": int(emp_dict.get("JobSatisfaction", 0)),
            "WorkLifeBalance": int(emp_dict.get("WorkLifeBalance", 0)),
            "risk_score_percentage": pred_res["attrition_risk_percentage"],
            "prediction": pred_res["prediction"],
            "top_factor": top_factor_name,
            "raw_data": emp_dict
        }
        records.append(record)
        
    _processed_records = records
    return _processed_records

@router.get("", response_model=Dict[str, Any])
async def get_employees(
    department: Optional[str] = Query(None, description="Filter berdasarkan departemen"),
    search: Optional[str] = Query(None, description="Cari berdasarkan ID karyawan atau Jabatan"),
    sort_by: str = Query("risk_score_percentage", description="Kolom untuk pengurutan"),
    order: str = Query("desc", description="Urutan: asc atau desc"),
    page: int = Query(1, ge=1, description="Halaman ke-n"),
    limit: int = Query(20, ge=1, le=100, description="Jumlah item per halaman")
):
    """
    Mengembalikan daftar karyawan dengan filter, pengurutan, dan paginasi.
    """
    try:
        data = load_employee_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal membaca data karyawan: {str(e)}")

    # Filter Department
    if department:
        data = [emp for emp in data if emp["Department"].lower() == department.lower()]

    # Filter Search
    if search:
        search_lower = search.lower()
        data = [
            emp for emp in data 
            if search_lower in str(emp["employee_id"]) 
            or search_lower in emp["JobRole"].lower()
            or search_lower in emp["Department"].lower()
        ]

    # Sorting
    reverse = True if order.lower() == "desc" else False
    if sort_by in ["risk_score_percentage", "MonthlyIncome", "Age", "YearsAtCompany", "employee_id"]:
        data = sorted(data, key=lambda x: x.get(sort_by, 0), reverse=reverse)

    # Pagination
    total = len(data)
    total_pages = (total + limit - 1) // limit
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_items = data[start_idx:end_idx]

    # Clean raw_data out of list response to keep list light
    light_items = []
    for item in paginated_items:
        clean_item = {k: v for k, v in item.items() if k != "raw_data"}
        light_items.append(clean_item)

    return {
        "data": light_items,
        "meta": {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }
    }

@router.get("/{employee_id}", response_model=Dict[str, Any])
async def get_employee_detail(employee_id: int):
    """
    Mengembalikan detail profil karyawan lengkap beserta hasil prediksi & analisis SHAP.
    """
    data = load_employee_data()
    emp = next((e for e in data if e["employee_id"] == employee_id), None)
    
    if not emp:
        raise HTTPException(status_code=404, detail=f"Karyawan dengan ID {employee_id} tidak ditemukan")

    raw_dict = emp["raw_data"]
    prediction = predict_employee_attrition(raw_dict)
    explanation = explain_employee_attrition(raw_dict, top_n=5)

    return {
        "employee_id": employee_id,
        "profile": raw_dict,
        "prediction": prediction,
        "explanation": explanation
    }
