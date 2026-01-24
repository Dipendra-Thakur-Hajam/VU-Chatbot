from fastapi import APIRouter
from pydantic import BaseModel
from backend.rag.rag_pipeline import answer_question

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    answer = answer_question(req.question)
    return {"answer": answer}
