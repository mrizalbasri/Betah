import os
from dotenv import load_dotenv

# Auto load backend/.env file
load_dotenv()

from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from app.agent.tools import tools

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

DEFAULT_SYSTEM_PROMPT = """Kamu adalah AI Assistant Employee Attrition Advisor yang bertugas membantu HR Manager di PT Betah Indonesia.

Tugas utamamu adalah memberikan analisis risiko resign karyawan dan merekomendasikan langkah retensi yang tepat berdasarkan data model ML dan dokumen kebijakan HR resmi perusahaan.

Kamu memiliki 2 alat (tools) khusus:
1. `query_model_output(employee_id: int)`: Mengambil skor risiko resign (%), status prediksi, dan faktor pendorong utama (SHAP) untuk karyawan tertentu.
2. `retrieve_hr_policy(query: str)`: Mencari aturan resmi perusahaan (tunjangan retensi gaji, bonus kinerja, kebijakan lembur, WFH, insentif, promosi, benefit) dari dokumen RAG.

ATURAN BAHASA & FORMAT:
- Jawablah dalam Bahasa Indonesia yang formal, natural, sopan, dan mudah dipahami oleh HR Manager.
- DILARANG KERAS menggunakan Bahasa Mandarin, karakter China (Hanzi), atau bahasa asing lainnya.
- Sajikan jawaban dengan rapi, jelas, dan profesional. Tidak perlu memaksakan format yang kaku, yang penting mudah dan nyaman dibaca.
- Jika pertanyaan HR menyebutkan ID karyawan tertentu (misal: ID 622, karyawan 1), GUNAKAN `query_model_output` terlebih dahulu untuk memeriksa kondisi karyawan tersebut.
- Jika kamu butuh rekomendasi tindakan retensi, bonus, atau aturan perusahaan, GUNAKAN `retrieve_hr_policy` untuk mengambil kebijakan resmi.
- DILARANG menampilkan tag mentah seperti [Target Karyawan ID: ...], data JSON mentah, atau simbol mentah yang mengganggu."""

SYSTEM_PROMPT = os.getenv("CUSTOM_SYSTEM_PROMPT") or DEFAULT_SYSTEM_PROMPT

def get_llm_with_tools():
    """
    Menginisialisasi LLM secara dinamis dari LLM_API_KEY, LLM_BASE_URL, dan LLM_MODEL_NAME di .env.
    """
    api_key = os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("LLM_BASE_URL") or os.getenv("OPENAI_BASE_URL")
    model_name = os.getenv("LLM_MODEL_NAME") or os.getenv("OPENAI_MODEL_NAME") or "gpt-4o-mini"

    if not api_key or api_key in ["your_llm_api_key_here", "your_openai_api_key_here", "your_api_key_here"]:
        raise ValueError(
            "LLM_API_KEY belum dikonfigurasi di file backend/.env. "
            "Harap masukkan API Key yang valid untuk mengaktifkan AI Agent."
        )

    from langchain_openai import ChatOpenAI

    kwargs = {
        "model": model_name,
        "api_key": api_key,
        "temperature": 0.2,
        "request_timeout": 60
    }
    if base_url:
        kwargs["base_url"] = base_url

    llm = ChatOpenAI(**kwargs)
    return llm.bind_tools(tools)


def call_model_node(state: AgentState) -> dict:
    """
    Node pemanggil LLM secara live.
    """
    messages = state["messages"]
    
    # Sisipkan system prompt di awal jika belum ada
    if not messages or not isinstance(messages[0], SystemMessage):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + list(messages)
        
    llm = get_llm_with_tools()
    response = llm.invoke(messages)
    return {"messages": [response]}


# Konstruksi Graph LangGraph
workflow = StateGraph(AgentState)

# Node 1: Call Model LLM
workflow.add_node("agent", call_model_node)

# Node 2: Executing Tools
tool_node = ToolNode(tools)
workflow.add_node("tools", tool_node)

# Edges
workflow.add_edge(START, "agent")

def route_after_agent(state: AgentState):
    messages = state["messages"]
    last_msg = messages[-1]
    
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        return "tools"
    return END

workflow.add_conditional_edges("agent", route_after_agent, ["tools", END])
workflow.add_edge("tools", "agent")

# Compile Graph
app_graph = workflow.compile()
