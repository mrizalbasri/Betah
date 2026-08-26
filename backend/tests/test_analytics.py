import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_analytics_summary():
    response = client.get("/api/analytics/summary")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    
    data = response.json()
    assert "overview" in data
    assert "department_breakdown" in data
    assert "top_company_factors" in data

    overview = data["overview"]
    assert "total_employees" in overview
    assert overview["total_employees"] > 0
    assert "high_risk_count" in overview
    assert "high_risk_percentage" in overview

    assert isinstance(data["department_breakdown"], list)
    assert len(data["department_breakdown"]) > 0

    print(f"\n[V] GET /api/analytics/summary BERHASIL! (Total employees: {overview['total_employees']}, High risk %: {overview['high_risk_percentage']}%)")

if __name__ == "__main__":
    test_get_analytics_summary()
