import os
import io
import pandas as pd
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Response
from app.core.config import settings
from app.ml.predict import predict_employee_attrition, predict_batch_attrition
from app.ml.explain import explain_employee_attrition

router = APIRouter(prefix="/employees", tags=["Employees"])

_dataset_cache: Optional[pd.DataFrame] = None
_processed_records: Optional[List[Dict[str, Any]]] = None

FIRST_NAMES = [
  "Aditya", "Budi", "Citra", "Dewi", "Eko", "Fikri", "Gita", "Hendra", "Indah", "Joko",
  "Kiki", "Lestari", "Mega", "Nugroho", "Oki", "Putri", "Rian", "Siti", "Taufik", "Utami",
  "Vina", "Wawan", "Yulia", "Zainal", "Ahmad", "Bambang", "Diah", "Farhan", "Hasan", "Rina"
]
LAST_NAMES = [
  "Pratama", "Santoso", "Wijaya", "Kusuma", "Hidayat", "Saputra", "Wibowo", "Suryono",
  "Utomo", "Siregar", "Nasution", "Firmansyah", "Gunawan", "Setiawan", "Suharto", "Lestari"
]

def generate_employee_name(emp_id: int) -> str:
    first_name = FIRST_NAMES[emp_id % len(FIRST_NAMES)]
    last_name = LAST_NAMES[(emp_id * 3) % len(LAST_NAMES)]
    return f"{first_name} {last_name}"

def load_employee_data() -> List[Dict[str, Any]]:
    """
    Memuat dataset karyawan dari CSV dan menghitung risk score untuk semua karyawan
    sekaligus (batch inference). Menggunakan in-memory caching agar respons cepat.
    """
    global _processed_records
    if _processed_records is not None:
        return _processed_records

    if not os.path.exists(settings.DATASET_PATH):
        raise FileNotFoundError(f"File dataset tidak ditemukan di: {settings.DATASET_PATH}")

    df = pd.read_csv(settings.DATASET_PATH)

    if "EmployeeNumber" not in df.columns:
        df["EmployeeNumber"] = range(1, len(df) + 1)

    # Batch inference — satu kali model.predict_proba() untuk semua baris
    print(f"[*] Memproses prediksi batch untuk {len(df)} karyawan...")
    predictions = predict_batch_attrition(df)
    print(f"[+] Batch inference selesai.")

    records = []
    for i, (_, row) in enumerate(df.iterrows()):
        emp_dict = row.to_dict()
        emp_id = int(emp_dict["EmployeeNumber"])
        emp_name = str(emp_dict.get("Name") or emp_dict.get("EmployeeName") or generate_employee_name(emp_id))
        pred_res = predictions[i]

        top_factor_name = (
            "Kerja Lembur (OverTime)"
            if emp_dict.get("OverTime") == "Yes"
            else f"Masa Kerja: {emp_dict.get('YearsAtCompany', 0)} Tahun"
        )

        record = {
            "employee_id": emp_id,
            "EmployeeNumber": emp_id,
            "name": emp_name,
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
            "raw_data": emp_dict,
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
    limit: int = Query(20, ge=1, le=2000, description="Jumlah item per halaman")
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

    # Filter Search (ID, Nama, Jabatan, Departemen)
    if search:
        search_lower = search.lower()
        data = [
            emp for emp in data 
            if search_lower in str(emp["employee_id"]) 
            or search_lower in emp.get("name", "").lower()
            or search_lower in emp.get("JobRole", "").lower()
            or search_lower in emp.get("Department", "").lower()
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


@router.post("/upload-csv", response_model=Dict[str, Any])
async def upload_employee_csv(file: UploadFile = File(...)):
    """
    Mengunggah file CSV data karyawan baru, memproses prediksi XGBoost & SHAP,
    dan memperbarui dataset aktif di seluruh aplikasi.
    """
    global _processed_records
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File harus berformat .csv")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal membaca file CSV: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="File CSV kosong")

    if "EmployeeNumber" not in df.columns:
        df["EmployeeNumber"] = range(1, len(df) + 1)

    new_records = []
    for _, row in df.iterrows():
        emp_dict = row.to_dict()
        emp_id = int(emp_dict["EmployeeNumber"])
        emp_name = str(emp_dict.get("Name") or emp_dict.get("EmployeeName") or generate_employee_name(emp_id))
        
        pred_res = predict_employee_attrition(emp_dict)
        top_factor_name = "Kerja Lembur (OverTime)" if emp_dict.get("OverTime") == "Yes" else f"Masa Kerja: {emp_dict.get('YearsAtCompany', 0)} Tahun"
        
        record = {
            "employee_id": emp_id,
            "EmployeeNumber": emp_id,
            "name": emp_name,
            "Age": int(emp_dict.get("Age", 30)),
            "Gender": str(emp_dict.get("Gender", "Male")),
            "Department": str(emp_dict.get("Department", "General")),
            "JobRole": str(emp_dict.get("JobRole", "Staff")),
            "MonthlyIncome": float(emp_dict.get("MonthlyIncome", 5000)),
            "OverTime": str(emp_dict.get("OverTime", "No")),
            "YearsAtCompany": int(emp_dict.get("YearsAtCompany", 1)),
            "YearsInCurrentRole": int(emp_dict.get("YearsInCurrentRole", 1)),
            "JobSatisfaction": int(emp_dict.get("JobSatisfaction", 3)),
            "WorkLifeBalance": int(emp_dict.get("WorkLifeBalance", 3)),
            "risk_score_percentage": pred_res["attrition_risk_percentage"],
            "prediction": pred_res["prediction"],
            "top_factor": top_factor_name,
            "raw_data": emp_dict
        }
        new_records.append(record)

    _processed_records = new_records

    # Re-calculate summary metadata
    high_risk_count = sum(1 for r in new_records if r["risk_score_percentage"] >= 65)
    avg_risk = sum(r["risk_score_percentage"] for r in new_records) / len(new_records)

    return {
        "status": "success",
        "message": f"Berhasil mengunggah dan menganalisis {len(new_records)} data karyawan.",
        "summary": {
            "total_employees": len(new_records),
            "high_risk_count": high_risk_count,
            "avg_risk_percentage": round(avg_risk, 1)
        }
    }


@router.get("/template-csv")
async def download_csv_template():
    """
    Mengunduh file templat standar CSV data karyawan untuk input Betah.
    """
    sample_data = {
        "Age": [35, 28, 42],
        "BusinessTravel": ["Travel_Rarely", "Travel_Frequently", "Non-Travel"],
        "DailyRate": [800, 1100, 650],
        "Department": ["Sales", "Research & Development", "Human Resources"],
        "DistanceFromHome": [10, 2, 25],
        "Education": [3, 4, 2],
        "EducationField": ["Life Sciences", "Medical", "Human Resources"],
        "EnvironmentSatisfaction": [3, 2, 4],
        "Gender": ["Male", "Female", "Male"],
        "HourlyRate": [60, 85, 45],
        "JobInvolvement": [3, 2, 3],
        "JobLevel": [2, 3, 1],
        "JobRole": ["Sales Executive", "Research Scientist", "HR Specialist"],
        "JobSatisfaction": [3, 1, 4],
        "MaritalStatus": ["Single", "Married", "Divorced"],
        "MonthlyIncome": [5000, 8500, 4200],
        "MonthlyRate": [15000, 21000, 12000],
        "NumCompaniesWorked": [2, 1, 4],
        "OverTime": ["Yes", "Yes", "No"],
        "PercentSalaryHike": [12, 18, 14],
        "PerformanceRating": [3, 4, 3],
        "RelationshipSatisfaction": [3, 2, 4],
        "StockOptionLevel": [1, 0, 2],
        "TotalWorkingYears": [10, 6, 15],
        "TrainingTimesLastYear": [2, 3, 2],
        "WorkLifeBalance": [3, 2, 3],
        "YearsAtCompany": [5, 4, 10],
        "YearsInCurrentRole": [3, 2, 7],
        "YearsSinceLastPromotion": [1, 1, 3],
        "YearsWithCurrManager": [3, 2, 5]
    }
    df_sample = pd.DataFrame(sample_data)
    stream = io.StringIO()
    df_sample.to_csv(stream, index=False)
    
    return Response(
        content=stream.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=betah_employee_sample_template.csv"}
    )

