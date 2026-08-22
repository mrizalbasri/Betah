# Betah — Employee Attrition Advisor 🏢⚡

**Betah** adalah sistem internal HR Manager Dashboard berbasis AI yang memprediksi risiko *attrition* (resign) karyawan dan memberikan analisis faktor-faktor penyebab utama (menggunakan SHAP) serta menyertakan **AI Assistant** berbasis **LangGraph Agent** yang mampu mengambil keputusan secara otomatis kapan harus mengakses dokumen kebijakan HR (RAG) vs data hasil prediksi ML.

Project ini dibangun untuk **AI Engineer Bootcamp Final Project**.

---

## 🏗 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js 14 Dashboard                   │
│   - Employee Table (Sortable/Filterable by Risk Score)      │
│   - Employee Detail View (SHAP Top Factors Visualization)   │
│   - Embedded HR Assistant Chat Panel (Vercel AI SDK)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / SSE
┌──────────────────────────────▼──────────────────────────────┐
│                       FastAPI Backend                       │
│  ├── /api/employees  → HR Data & Attrition Risk Scores       │
│  ├── /api/predict    → ML Model Inference (XGBoost/SHAP)    │
│  └── /api/chat       → LangGraph Agent (Tool Selection)     │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐┌──────────────▼──────────────┐
│  ML Model (XGBoost + SHAP) ││ Vector DB (ChromaDB - RAG)  │
│  Logged via MLflow          ││ Dokumen Policy HR           │
└─────────────────────────────┘└─────────────────────────────┘
```

---

## 📂 Struktur Repositori

```
Betah/
├── .github/                # GitHub Actions Workflows & Templates (PR, Issue)
├── docs/                   # Dokumen PRD & Spesifikasi Proyek (PRD_Employee_Attrition_Advisor.md)
├── frontend/               # Next.js App Router, HeroUI, Tailwind CSS, TypeScript
├── backend/                # FastAPI, ML Pipeline, LangGraph Agent, RAG
├── data/                   # Dataset IBM HR Analytics & Dokumen Dummy HR Policy
├── docker-compose.yml      # Container orchestration
└── README.md
```

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

### Option A: Menggunakan Docker Compose (Direkomendasikan)

1. **Clone repositori:**
   ```bash
   git clone https://github.com/USERNAME/Betah.git
   cd Betah
   ```

2. **Salin environment variables:**
   ```bash
   cp .env.example .env
   # Edit file .env dan isi GOOGLE_API_KEY
   ```

3. **Jalankan aplikasi:**
   ```bash
   docker compose up --build
   ```
   - **Frontend:** http://localhost:3000
   - **Backend API Docs:** http://localhost:8000/docs

---

### Option B: Menjalankan Secara Manual (Development)

#### 1. Setup Backend:
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Setup Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠 Tugas & Pembagian Kerja Tim

- **Frontend Engineer:** Melengkapi komponen UI dashboard (`src/components`), tabel karyawan, detail SHAP, dan panel streaming chat di `frontend/`.
- **Backend & AI Engineer:** Mengembangkan agent LangGraph (`backend/app/agent`), pipeline RAG ChromaDB (`backend/app/rag`), dan API endpoints di `backend/app/api`.
- **ML Engineer:** Eksperimen model di MLflow (`backend/app/ml/train.py`), evaluasi model XGBoost/RandomForest, dan kalkulasi SHAP value.

---

## 🤝 Panduan Kolaborasi (Git Workflow)

1. Pull perubahan terbaru dari `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Buat branch baru untuk fitur Anda:
   ```bash
   git checkout -b feature/nama-fitur
   ```
3. Commit & push ke GitHub:
   ```bash
   git add .
   git commit -m "feat: tambahkan fitur X"
   git push origin feature/nama-fitur
   ```
4. Buat **Pull Request (PR)** ke branch `main`.

---

## 📄 Lisensi & Catatan Etika
Skor attrition **hanya untuk penggunaan internal HR Manager** dan tidak ditampilkan kepada karyawan. Dokumen kebijakan HR yang digunakan dalam proyek ini adalah simulasi/dummy untuk keperluan akademis bootcamp.
