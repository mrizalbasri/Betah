import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_employees_list():
    response = client.get("/api/employees")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "data" in data
    assert "meta" in data
    assert isinstance(data["data"], list)
    assert len(data["data"]) > 0
    
    # Check structure of first employee item
    emp = data["data"][0]
    assert "employee_id" in emp
    assert "Department" in emp
    assert "risk_score_percentage" in emp
    print(f"\n[V] GET /api/employees BERHASIL! (Total data: {len(data['data'])})")

def test_get_employees_with_filters():
    response = client.get("/api/employees?department=Sales&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) <= 10
    for emp in data["data"]:
        assert emp["Department"] == "Sales"
    print("[V] GET /api/employees dengan filter department & limit BERHASIL!")

def test_get_employee_by_id_valid():
    # First get valid employee_id from list
    list_res = client.get("/api/employees?limit=1")
    first_id = list_res.json()["data"][0]["employee_id"]

    response = client.get(f"/api/employees/{first_id}")
    assert response.status_code == 200
    emp = response.json()
    assert emp["employee_id"] == first_id
    assert "prediction" in emp
    assert "explanation" in emp
    print(f"[V] GET /api/employees/{first_id} BERHASIL!")

def test_get_employee_by_id_invalid():
    response = client.get("/api/employees/999999")
    assert response.status_code == 404
    print("[V] GET /api/employees/999999 (invalid ID) BERHASIL menangani 404!")

if __name__ == "__main__":
    test_get_employees_list()
    test_get_employees_with_filters()
    test_get_employee_by_id_valid()
    test_get_employee_by_id_invalid()
