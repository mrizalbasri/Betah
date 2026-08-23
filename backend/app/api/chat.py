from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from langchain_core.messages import HumanMessage
from app.agent.graph import app_graph

router = APIRouter(prefix="/chat", tags=["AI Agent Chat"])

class ChatRequest(BaseModel):
    message: str = Field(..., example="Rekomendasi retensi untuk karyawan ID 622 apa ya?")
    employee_id: Optional[int] = Field(None, example=622)

@router.post("", response_model=Dict[str, Any])
async def chat_with_agent(payload: ChatRequest):
    """
    Endpoint AI Assistant untuk HR Manager.
    Membuat rekomendasi retensi karyawan secara otomatis dengan menggabungkan hasil ML dan RAG kebijakan HR.
    """
    try:
        user_prompt = payload.message
        if payload.employee_id and str(payload.employee_id) not in user_prompt:
            user_prompt = f"[Target Karyawan ID: {payload.employee_id}] {user_prompt}"
            
        initial_state = {
            "messages": [HumanMessage(content=user_prompt)]
        }
        
        final_state = app_graph.invoke(initial_state)
        messages = final_state.get("messages", [])
        
        last_message = messages[-1] if messages else None
        response_content = last_message.content if last_message else "Tidak ada tanggapan dari AI."
        
        # Ekstrak tools yang dipanggil selama eksekusi
        tools_called = []
        for msg in messages:
            if hasattr(msg, "tool_calls") and msg.tool_calls:
                for tc in msg.tool_calls:
                    tools_called.append(tc.get("name"))
                    
        return {
            "response": response_content,
            "tools_called": list(set(tools_called)),
            "employee_id": payload.employee_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses chat agent: {str(e)}")
