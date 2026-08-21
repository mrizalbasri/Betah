# Backend & AI Service — Betah

Service backend menggunakan **FastAPI**, **LangGraph Agent**, **ChromaDB**, dan **XGBoost + SHAP**.

## 📁 Struktur Kode Backend

```
backend/
├── app/
│   ├── main.py          # Entry point FastAPI & route registration
│   ├── core/
│   │   └── config.py    # Environment settings (Pydantic settings)
│   ├── api/             # API Router endpoints
│   │   ├── employees.py # Endpoint data karyawan & risk score
│   │   ├── predict.py   # Endpoint model ML predict
│   │   └── chat.py      # Endpoint streaming AI assistant
│   ├── ml/              # Machine Learning module
│   │   ├── train.py     # Training script & MLflow experiment logging
│   │   ├── predict.py   # ML inference logic
│   │   └── explain.py   # SHAP value calculator per employee
│   ├── agent/           # LangGraph Agent module
│   │   ├── graph.py     # StateGraph definition & tool decision routing
│   │   └── tools.py     # Tool definition (query_model_output, retrieve_hr_policy)
│   └── rag/             # Vector Database module
│       ├── ingest.py    # Document loader & ChromaDB embedding pipeline
│       └── vectorstore.py # ChromaDB helper
├── Dockerfile
└── requirements.txt
```

## 🚀 Cara Menjalankan Backend secara Lokal

```bash
# Activation virtual environment
python -m venv .venv
source .venv/bin/activate  # atau .venv\Scripts\activate di Windows

# Install requirements
pip install -r requirements.txt

# Menjalankan FastAPI server
uvicorn app.main:app --reload --port 8000
```
