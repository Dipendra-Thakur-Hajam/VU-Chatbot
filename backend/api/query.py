from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from backend.rag.rag_pipeline import answer_question, stream_answer_question

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """Traditional blocking endpoint for backward compatibility"""
    answer = answer_question(req.question)
    return {"answer": answer}


@router.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    """
    Streaming endpoint - responds like ChatGPT
    Sends response tokens in real-time
    """
    async def response_generator():
        async for chunk in stream_answer_question(req.question):
            yield f"data: {chunk}\n\n"
    
    return StreamingResponse(
        response_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )
