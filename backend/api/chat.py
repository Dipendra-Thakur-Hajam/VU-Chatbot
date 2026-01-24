from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.rag.retriever import retrieve_context
from backend.granite.granite_client import GraniteClient
import logging

# Configure logger
logger = logging.getLogger(__name__)

router = APIRouter()
try:
    granite = GraniteClient()
except Exception as e:
    logger.error(f"Failed to initialize GraniteClient: {e}")
    granite = None

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
def chat(req: ChatRequest):
    if not granite:
        raise HTTPException(status_code=503, detail="Granite service unavailable")

    try:
        context = retrieve_context(req.question)
    except Exception as e:
        logger.error(f"Error retrieving context: {e}")
        context = "No context available due to an internal error."

    prompt = f"""
You are a helpful and friendly college admission assistant for VU (Virtual University).
Your goal is to assist students with admissions, programs, fees, and campus life queries.

Instructions:
1. Answer strictly using the context provided below.
2. If the context does not contain the answer, politely say currently you don't have that information.
3. Keep the tone professional yet welcoming.
4. Format your answer using Markdown (e.g., bullet points, bold text) for readability.

Context:
{context}

Question:
{req.question}

Answer:
"""

    try:
        answer = granite.generate_chat_response(prompt)
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate response")

    return {
        "answer": answer,
        "sources": context
    }
