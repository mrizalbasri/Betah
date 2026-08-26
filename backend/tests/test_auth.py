import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_success():
    response = client.post("/api/auth/login", json={
        "email": "admin@betah.id",
        "password": "admin123"
    })
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@betah.id"
    assert data["user"]["role"] == "HR Director"
    print("\n[V] Test login success BERHASIL!")

def test_login_invalid_password():
    response = client.post("/api/auth/login", json={
        "email": "admin@betah.id",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert "salah" in response.json()["detail"]
    print("[V] Test login invalid password BERHASIL!")

def test_get_current_user_me():
    login_res = client.post("/api/auth/login", json={
        "email": "manager@betah.id",
        "password": "manager123"
    })
    token = login_res.json()["access_token"]
    
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "manager@betah.id"
    assert me_res.json()["role"] == "HR Analytics Manager"
    print("[V] Test get_current_user_me BERHASIL!")

if __name__ == "__main__":
    test_login_success()
    test_login_invalid_password()
    test_get_current_user_me()
