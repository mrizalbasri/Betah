<div align="center">

# Betah — Employee Attrition Advisor

**Enterprise AI-powered HR Manager Decision Support System**

*Predictive Attrition Analytics • Explainable AI (SHAP) • LangGraph RAG Agent • Executive Dashboard*

`Next.js 16 (App Router)` • `FastAPI` • `XGBoost + SHAP` • `LangGraph` • `ChromaDB (RAG)` • `MLflow`

</div>

---

## 1. System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                  Next.js 16 Dashboard Frontend              │
│  - Analytics Overview Cards & Department Breakdown Charts   │
│  - Employee Attrition Risk Table (Filterable & Sortable)    │
│  - Employee SHAP Risk Driver & Retention Anchor View        │
│  - Embedded HR Retention AI Assistant Panel                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API / HTTP
┌──────────────────────────────▼──────────────────────────────┐
│                       FastAPI Backend                       │
│  ├── /api/analytics  → Summary Metrics & Department Rates   │
│  ├── /api/employees  → Employee Data & Risk Predictions     │
│  ├── /api/predict    → Candidate Attrition Risk Simulation  │
│  └── /api/chat       → LangGraph Agent Tool Dispatcher      │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐┌──────────────▼──────────────┐
│  ML Inference & SHAP Engine ││ Vector DB (ChromaDB - RAG)  │
│  - Tuned XGBoost Classifier ││ - HuggingFace Embeddings     │
│  - SHAP TreeExplainer       ││ - HR Policy Document Store   │
│  - MLflow Experiment Tracker││                              │
└─────────────────────────────┘└─────────────────────────────┘
```

---

## 2. Tech Stack

- **Frontend Core**: Next.js 16 (App Router), React 19, TypeScript.
- **Frontend UI & Styling**: Tailwind CSS, HeroUI, Lucide React icons.
- **Backend Framework**: FastAPI, Python 3.11+, Pydantic v2, Uvicorn.
- **Machine Learning & Explainability**: XGBoost Classifier, Scikit-Learn, SHAP TreeExplainer, MLflow Tracking.
- **AI Agent & RAG Pipeline**: LangGraph, LangChain, ChromaDB Vector DB, HuggingFace Embeddings (`all-MiniLM-L6-v2`), Google Gemini API (`gemini-1.5-flash`).
- **DevOps & Infrastructure**: Docker, Docker Compose, PostgreSQL.

---

## 3. Key Capabilities

1. **Predictive Attrition Modeling**: Calculates individual attrition risk percentages (0.0% – 100.0%) and binary risk flags using an optimized XGBoost classifier trained on IBM HR Analytics data.
2. **Explainable AI (SHAP)**: Extracts top risk drivers (e.g., OverTime, low monthly income relative to job level) and retention anchors for every employee record.
3. **Autonomous RAG Agent**: Uses a LangGraph `StateGraph` agent that dynamically decides when to query individual employee risk metrics (`query_model_output`) versus retrieving official company retention policies (`retrieve_hr_policy`) from ChromaDB.
4. **Executive Analytics API**: Provides aggregated metrics (`/api/analytics/summary`) covering company-wide risk rates, department-level risk distributions, and top global risk factors.

---

## 4. Repository Structure

```text
Betah/
├── backend/
│   ├── app/
│   │   ├── agent/         # LangGraph workflow graph and tool definitions
│   │   ├── api/           # FastAPI routers (employees, predict, chat, analytics)
│   │   ├── core/          # App configuration and CORS settings
│   │   ├── ml/            # Model training, inference, and SHAP explanation
│   │   └── rag/           # ChromaDB vectorstore and ingestion scripts
│   ├── main.py            # FastAPI main application entrypoint
│   └── requirements.txt   # Python dependency specifications
├── frontend/
│   ├── app/               # Next.js 16 App Router pages and layout
│   ├── src/
│   │   ├── components/    # UI components (dashboard, employee detail, chat)
│   │   ├── lib/           # API client utilities
│   │   └── types/         # TypeScript type definitions
│   └── package.json       # Node.js dependencies
├── data/
│   ├── WA_Fn-UseC_-HR-Employee-Attrition.csv  # IBM HR Analytics Dataset
│   └── hr_policies/       # Official HR Markdown policy documents
├── docs/                  # PRD and architectural specifications
├── docker-compose.yml     # Multi-container service orchestrator
└── README.md
```

---

## 5. Getting Started

### Method A: Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/mrizalbasri/Betah.git
   cd Betah
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Add your GOOGLE_API_KEY inside .env
   ```

3. Launch containers:
   ```bash
   docker compose up --build
   ```
   - **Frontend Application**: `http://localhost:3000`
   - **Backend API Documentation**: `http://localhost:8000/docs`

---

### Method B: Manual Local Development

#### 1. Backend Setup

```bash
cd backend
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 6. API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check endpoint |
| `GET` | `/api/analytics/summary` | Aggregated executive metrics, department breakdown, and global risk factors |
| `GET` | `/api/employees` | Paginated employee list with search, department filtering, and risk score sorting |
| `GET` | `/api/employees/{id}` | Detailed employee profile with SHAP top risk drivers and retention anchors |
| `POST` | `/api/predict` | Real-time candidate attrition risk simulation |
| `POST` | `/api/chat` | Autonomous LangGraph AI Agent consultation combining ML output and RAG policy retrieval |

---

## 7. Model Evaluation & Security

### Machine Learning Experiment Tracking (MLflow)

Four model architectures were evaluated and tracked via MLflow (`backend/app/ml/train.py`):

| Model | F1-Score | ROC-AUC | Status |
|---|---|---|---|
| Logistic Regression (Baseline) | 0.3729 | 0.7809 | Evaluated |
| Random Forest Classifier | 0.3684 | 0.7546 | Evaluated |
| XGBoost Classifier (Default) | 0.4054 | 0.7697 | Evaluated |
| **XGBoost Classifier (Tuned)** | **0.4231** | **0.7905** | **Registered Model (Production)** |

To view the MLflow tracking UI locally:
```bash
cd backend
uv run mlflow ui
```

### Prompt Injection Defense & Agent Security

The AI Assistant is protected against prompt injection and privilege escalation through strict tool isolation:
- Tool execution is scoped strictly to `query_model_output` and `retrieve_hr_policy`.
- System prompts enforce strict context boundaries (HR policy and employee retention domain only).
- Fallback deterministic handlers ensure service availability even under unexpected prompt inputs.

---

## 8. License & Ethical Disclaimer

This application is strictly designed for internal HR Manager decision support. Attrition risk scores are advisory metrics and should not be displayed directly to employees. Policy documents included in `data/hr_policies/` are simulated documents created for academic bootcamp demonstration purposes.
