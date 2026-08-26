import json
from langchain_core.tools import tool
from app.api.employees import load_employee_data
from app.ml.predict import predict_employee_attrition
from app.ml.explain import explain_employee_attrition
from app.rag.vectorstore import query_vectorstore

@tool
def query_model_output(employee_id: int) -> str:
    """
    Mengambil hasil prediksi model ML dan faktor pendorong risiko resign (SHAP) untuk satu karyawan berdasarkan ID-nya.
    Gunakan tool ini ketika HR bertanya tentang status risiko, probabilitas resign, atau faktor pendorong resign karyawan tertentu.
    
    Args:
        employee_id (int): ID karyawan (contoh: 1, 622).
    """
    try:
        data = load_employee_data()
        emp = next((e for e in data if e["employee_id"] == employee_id), None)
        
        if not emp:
            return json.dumps({"error": f"Karyawan dengan ID {employee_id} tidak ditemukan di database."})
            
        raw_dict = emp["raw_data"]
        prediction = predict_employee_attrition(raw_dict)
        explanation = explain_employee_attrition(raw_dict, top_n=5)
        
        result = {
            "employee_id": employee_id,
            "job_role": raw_dict.get("JobRole"),
            "department": raw_dict.get("Department"),
            "monthly_income": raw_dict.get("MonthlyIncome"),
            "overtime": raw_dict.get("OverTime"),
            "years_at_company": raw_dict.get("YearsAtCompany"),
            "risk_score_percentage": prediction["attrition_risk_percentage"],
            "prediction": prediction["prediction"],
            "top_risk_factors": [
                {
                    "feature": f["display_name"],
                    "value": f["feature_value"],
                    "shap_contribution": round(f["shap_value"], 4)
                } for f in explanation.get("top_increase_factors", [])
            ],
            "top_retention_anchors": [
                {
                    "feature": f["display_name"],
                    "value": f["feature_value"],
                    "shap_contribution": round(f["shap_value"], 4)
                } for f in explanation.get("top_decrease_factors", [])
            ]
        }
        return json.dumps(result, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"error": f"Gagal mengambil data model: {str(e)}"})

@tool
def retrieve_hr_policy(query: str) -> str:
    """
    Mengambil potongan dokumen kebijakan HR perusahaan (retensi gaji, lembur, insentif, WFH, promosi, benefit) dari RAG vectorstore.
    Gunakan tool ini ketika HR bertanya tentang rekomendasi tindakan retensi, aturan perusahaan, besaran bonus, atau kebijakan resmi.
    
    Args:
        query (str): Pertanyaan atau kata kunci pencarian kebijakan (contoh: 'kebijakan retensi gaji', 'insentif lembur').
    """
    try:
        import re
        # Clean metadata prefix tags like [Target Karyawan ID: 622] for clean semantic search
        clean_query = re.sub(r'\[Target Karyawan ID: \d+\]', '', query).strip()
        if not clean_query:
            clean_query = query

        chunks = query_vectorstore(query=clean_query, n_results=3)
        if not chunks:
            return "Tidak ditemukan kebijakan HR yang cocok di dokumen perusahaan."
            
        formatted_sources = []
        for i, chunk in enumerate(chunks, 1):
            formatted_sources.append(
                f"[Sumber {i}: {chunk['source']}]\n{chunk['content']}"
            )
            
        return "\n\n".join(formatted_sources)
    except Exception as e:
        return f"Gagal membaca kebijakan HR: {str(e)}"

# Export list of tools for LangGraph
tools = [query_model_output, retrieve_hr_policy]
