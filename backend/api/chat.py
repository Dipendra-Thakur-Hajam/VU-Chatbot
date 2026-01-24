from fastapi import APIRouter
from pydantic import BaseModel
from backend.rag.retriever import retrieve_context
from backend.granite.granite_client import GraniteClient

router = APIRouter()
granite = GraniteClient()

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
def chat(req: ChatRequest):
    context = retrieve_context(req.question)

    prompt = f"""
You are a college admission assistant.
Answer strictly using the context below.

Context:
{context}

Question:
{req.question}
"""

    answer = granite.generate_chat_response(prompt)

    return {
        "answer": answer,
        "sources": context
    }
