import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_chat_with_agent_basic():
    # Basic query to verify agent responds without failing
    payload = {
        "message": "Apa kebijakan lembur perusahaan untuk karyawan?",
        "employee_id": 1
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    
    data = response.json()
    assert "response" in data
    assert "tools_called" in data
    assert isinstance(data["response"], str)
    assert len(data["response"]) > 0

    print(f"\n[V] POST /api/chat BERHASIL! (Tools called: {data['tools_called']})")

def test_chat_stream_endpoint():
    payload = {
        "message": "Bagaimana rekomendasi insentif karyawan?",
        "employee_id": 2
    }
    response = client.post("/api/chat/stream", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert "text/event-stream" in response.headers.get("content-type", "")
    
    # Read chunk stream
    content = response.text
    assert "data: " in content
    print("[V] POST /api/chat/stream SSE Generator BERHASIL!")

if __name__ == "__main__":
    test_chat_with_agent_basic()
    test_chat_stream_endpoint()
