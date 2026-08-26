import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_predict_attrition_success():
    payload = {
        "Age": 32,
        "BusinessTravel": "Travel_Frequently",
        "DailyRate": 500,
        "Department": "Research & Development",
        "DistanceFromHome": 25,
        "Education": 3,
        "EducationField": "Medical",
        "EnvironmentSatisfaction": 1,
        "Gender": "Female",
        "HourlyRate": 45,
        "JobInvolvement": 2,
        "JobLevel": 1,
        "JobRole": "Research Scientist",
        "JobSatisfaction": 1,
        "MaritalStatus": "Single",
        "MonthlyIncome": 2500,
        "MonthlyRate": 12000,
        "NumCompaniesWorked": 4,
        "OverTime": "Yes",
        "PercentSalaryHike": 11,
        "PerformanceRating": 3,
        "RelationshipSatisfaction": 1,
        "StockOptionLevel": 0,
        "TotalWorkingYears": 5,
        "TrainingTimesLastYear": 2,
        "WorkLifeBalance": 1,
        "YearsAtCompany": 2,
        "YearsInCurrentRole": 1,
        "YearsSinceLastPromotion": 0,
        "YearsWithCurrManager": 1
    }

    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    
    data = response.json()
    assert "prediction" in data
    assert "explanation" in data
    
    pred = data["prediction"]
    assert "prediction" in pred  # 'Yes' or 'No'
    assert "attrition_risk_percentage" in pred
    assert isinstance(pred["attrition_risk_percentage"], float)
    
    exp = data["explanation"]
    assert "base_value" in exp
    assert "top_increase_factors" in exp
    assert isinstance(exp["top_increase_factors"], list)

    print(f"\n[V] POST /api/predict BERHASIL! (Probability: {pred['attrition_risk_percentage']}%, Increase factors count: {len(exp['top_increase_factors'])})")

if __name__ == "__main__":
    test_predict_attrition_success()
