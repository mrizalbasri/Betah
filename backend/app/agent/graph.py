import os
import json
from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage, AIMessage, ToolMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from app.core.config import settings
from app.agent.tools import tools, query_model_output, retrieve_hr_policy

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

DEFAULT_SYSTEM_PROMPT = """Kamu adalah AI Assistant Employee Attrition Advisor yang bertugas membantu HR Manager di PT Betah Indonesia.

Tugas utamamu adalah memberikan analisis risiko resign karyawan dan merekomendasikan langkah retensi yang tepat berdasarkan data model ML dan dokumen kebijakan HR resmi perusahaan.

Kamu memiliki 2 alat (tools) khusus:
1. `query_model_output(employee_id: int)`: Mengambil skor risiko resign (%), status prediksi, dan faktor pendorong utama (SHAP) untuk karyawan tertentu.
2. `retrieve_hr_policy(query: str)`: Mencari aturan resmi perusahaan (tunjangan retensi gaji, bonus kinerja, kebijakan lembur, WFH, insentif, promosi, benefit) dari dokumen RAG.

ATURAN KERJA:
- Jika pertanyaan HR menyebutkan ID karyawan tertentu (misal: ID 622, karyawan 1), GUNAKAN `query_model_output` terlebih dahulu untuk memeriksa kondisi karyawan tersebut.
- Jika kamu butuh rekomendasi tindakan retensi, bonus, atau aturan perusahaan, GUNAKAN `retrieve_hr_policy` untuk mengambil kebijakan resmi.
- Selalu berikan jawaban yang profesional, empatik, terstruktur dengan poin-poin jelas, dan sertakan angka risikonya jika ada.
- Jawab dalam Bahasa Indonesia yang formal dan mudah dipahami oleh HR Manager."""

SYSTEM_PROMPT = os.getenv("CUSTOM_SYSTEM_PROMPT") or DEFAULT_SYSTEM_PROMPT

def get_llm_with_tools():
    """
    Menginisialisasi LLM secara 100% dinamis dari environment variables (.env):
    - OPENAI_API_KEY / LLM_API_KEY
    - OPENAI_BASE_URL / LLM_BASE_URL (misal: https://openrouter.ai/api/v1 atau http://localhost:11434/v1)
    - OPENAI_MODEL_NAME / LLM_MODEL_NAME (misal: gpt-4o-mini, meta-llama/llama-3.3-70b-instruct:free, dll)
    """
    api_key = os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY") or os.getenv("OPENROUTER_API_KEY") or os.getenv("GROQ_API_KEY")
    base_url = os.getenv("LLM_BASE_URL") or os.getenv("OPENAI_BASE_URL")
    model_name = os.getenv("LLM_MODEL_NAME") or os.getenv("OPENAI_MODEL_NAME")

    if api_key and api_key not in ["your_llm_api_key_here", "your_openai_api_key_here", "your_openrouter_api_key_here", "your_api_key_here"]:
        try:
            from langchain_openai import ChatOpenAI
            
            # Default auto-resolutions jika base_url/model_name tidak diisi
            if not base_url:
                if os.getenv("OPENROUTER_API_KEY"):
                    base_url = "https://openrouter.ai/api/v1"
                elif os.getenv("GROQ_API_KEY"):
                    base_url = "https://api.groq.com/openai/v1"
                    
            if not model_name:
                if os.getenv("OPENROUTER_API_KEY"):
                    model_name = "google/gemini-2.0-flash-exp:free"
                elif os.getenv("GROQ_API_KEY"):
                    model_name = "llama-3.3-70b-versatile"
                else:
                    model_name = "gpt-4o-mini"

            kwargs = {
                "model": model_name,
                "api_key": api_key,
                "temperature": 0.2
            }
            if base_url:
                kwargs["base_url"] = base_url

            llm = ChatOpenAI(**kwargs)
            return llm.bind_tools(tools)
        except Exception as e:
            print(f"[!] Gagal inisialisasi OpenAI-compatible LLM: {e}. Menggunakan fallback agent.")

    # 2. Cek Google Gemini
    google_key = os.getenv("GOOGLE_API_KEY") or getattr(settings, "GOOGLE_API_KEY", None)
    if google_key and google_key != "your_gemini_api_key_here":
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=google_key,
                temperature=0.2
            )
            return llm.bind_tools(tools)
        except Exception as e:
            print(f"[!] Gagal inisialisasi Gemini LLM: {e}. Menggunakan fallback agent.")

    return None


def fallback_agent_node(state: AgentState) -> dict:
    """
    Fallback agent node ketika API key belum diisi.
    Secara cerdas mendeteksi ID karyawan dan kata kunci kebijakan untuk mengeksekusi tools.
    """
    messages = state["messages"]
    last_msg = messages[-1] if messages else None
    user_text = last_msg.content if last_msg else ""
    
    # Cari apakah ada angka ID karyawan di teks
    import re
    ids_found = re.findall(r'\b\d+\b', user_text)
    
    tool_calls = []
    if ids_found:
        emp_id = int(ids_found[0])
        tool_calls.append({
            "name": "query_model_output",
            "args": {"employee_id": emp_id},
            "id": "call_model_1"
        })
        
    # Jika mengandung kata kebijakan/retensi/bonus/cuti/lembur
    keywords = ["retensi", "kebijakan", "gaji", "bonus", "lembur", "wfh", "promosi", "rekomendasi", "insentif"]
    if any(k in user_text.lower() for k in keywords) or not tool_calls:
        tool_calls.append({
            "name": "retrieve_hr_policy",
            "args": {"query": user_text},
            "id": "call_policy_1"
        })
        
    ai_msg = AIMessage(content="", tool_calls=tool_calls)
    return {"messages": [ai_msg]}

def call_model_node(state: AgentState) -> dict:
    """
    Node pemanggil LLM atau Fallback Agent.
    """
    messages = state["messages"]
    
    # Sisipkan system prompt di awal jika belum ada
    if not messages or not isinstance(messages[0], SystemMessage):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + list(messages)
        
    llm = get_llm_with_tools()
    if llm:
        response = llm.invoke(messages)
        return {"messages": [response]}
    else:
        return fallback_agent_node(state)

def synthesize_fallback_response_node(state: AgentState) -> dict:
    """
    Menyusun jawaban akhir profesional ketika dalam mode fallback (tanpa LLM external).
    """
    messages = state["messages"]
    
    # Cari pesan tool
    tool_msgs = [m for m in messages if isinstance(m, ToolMessage)]
    
    model_output_data = None
    policy_output_data = None
    
    for tm in tool_msgs:
        if tm.name == "query_model_output":
            try:
                model_output_data = json.loads(tm.content)
            except:
                model_output_data = tm.content
        elif tm.name == "retrieve_hr_policy":
            policy_output_data = tm.content

    response_text = "### 📋 Rekomendasi HR Manager — Betah Attrition Advisor\n\n"
    
    if model_output_data and isinstance(model_output_data, dict) and "error" not in model_output_data:
        emp_id = model_output_data.get("employee_id")
        role = model_output_data.get("job_role")
        risk_score = model_output_data.get("risk_score_percentage")
        status = model_output_data.get("prediction")
        
        response_text += f"**Hasil Analisis Karyawan (ID: {emp_id} - {role}):**\n"
        response_text += f"- **Status Prediksi:** {status} Resign\n"
        response_text += f"- **Tingkat Risiko Attrition:** `{risk_score}%`\n"
        
        factors = model_output_data.get("top_risk_factors", [])
        if factors:
            response_text += "- **Faktor Utama Pendorong Risiko Resign:**\n"
            for f in factors[:3]:
                response_text += f"  - {f['feature']} (Nilai: {f['value']})\n"
        response_text += "\n"
        
    if policy_output_data:
        response_text += "**Rekomendasi Tindakan Retensi & Kebijakan HR Terkait:**\n"
        response_text += f"{policy_output_data}\n\n"
        
    response_text += "--- \n*Catatan: Jawaban ini disintesis berdasarkan analisis data ML dan dokumen kebijakan resmi PT Betah Indonesia.*"
    
    return {"messages": [AIMessage(content=response_text)]}

# Konstruksi Graph LangGraph
workflow = StateGraph(AgentState)

# Node 1: Call Model / Fallback Agent
workflow.add_node("agent", call_model_node)

# Node 2: Executing Tools
tool_node = ToolNode(tools)
workflow.add_node("tools", tool_node)

# Node 3: Synthesizer (digunakan saat fallback)
workflow.add_node("synthesizer", synthesize_fallback_response_node)

# Edges
workflow.add_edge(START, "agent")

def route_after_agent(state: AgentState):
    messages = state["messages"]
    last_msg = messages[-1]
    
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        return "tools"
    return END

workflow.add_conditional_edges("agent", route_after_agent, ["tools", END])

def route_after_tools(state: AgentState):
    llm = get_llm_with_tools()
    if llm:
        return "agent"
    else:
        return "synthesizer"

workflow.add_conditional_edges("tools", route_after_tools, ["agent", "synthesizer"])
workflow.add_edge("synthesizer", END)

# Compile Graph
app_graph = workflow.compile()
