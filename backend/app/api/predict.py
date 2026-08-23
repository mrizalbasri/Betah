from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from app.ml.predict import predict_employee_attrition
from app.ml.explain import explain_employee_attrition

router = APIRouter(prefix="/predict", tags=["Predict"])

class PredictRequest(BaseModel):
    Age: int = Field(default=35, example=35)
    BusinessTravel: str = Field(default="Travel_Rarely", example="Travel_Rarely")
    DailyRate: int = Field(default=800, example=800)
    Department: str = Field(default="Sales", example="Sales")
    DistanceFromHome: int = Field(default=10, example=10)
    Education: int = Field(default=3, example=3)
    EducationField: str = Field(default="Life Sciences", example="Life Sciences")
    EnvironmentSatisfaction: int = Field(default=3, example=3)
    Gender: str = Field(default="Male", example="Male")
    HourlyRate: int = Field(default=60, example=60)
    JobInvolvement: int = Field(default=3, example=3)
    JobLevel: int = Field(default=2, example=2)
    JobRole: str = Field(default="Sales Executive", example="Sales Executive")
    JobSatisfaction: int = Field(default=3, example=3)
    MaritalStatus: str = Field(default="Single", example="Single")
    MonthlyIncome: int = Field(default=5000, example=5000)
    MonthlyRate: int = Field(default=15000, example=15000)
    NumCompaniesWorked: int = Field(default=2, example=2)
    OverTime: str = Field(default="No", example="No")
    PercentSalaryHike: int = Field(default=12, example=12)
    PerformanceRating: int = Field(default=3, example=3)
    RelationshipSatisfaction: int = Field(default=3, example=3)
    StockOptionLevel: int = Field(default=1, example=1)
    TotalWorkingYears: int = Field(default=10, example=10)
    TrainingTimesLastYear: int = Field(default=2, example=2)
    WorkLifeBalance: int = Field(default=3, example=3)
    YearsAtCompany: int = Field(default=5, example=5)
    YearsInCurrentRole: int = Field(default=3, example=3)
    YearsSinceLastPromotion: int = Field(default=1, example=1)
    YearsWithCurrManager: int = Field(default=3, example=3)

    class Config:
        extra = "allow"

@router.post("", response_model=Dict[str, Any])
async def predict_attrition(payload: PredictRequest):
    """
    Melakukan prediksi risiko attrition dan analisis SHAP untuk data input karyawan.
    """
    try:
        employee_dict = payload.model_dump()
        prediction = predict_employee_attrition(employee_dict)
        explanation = explain_employee_attrition(employee_dict, top_n=5)
        
        return {
            "prediction": prediction,
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses prediksi: {str(e)}")
