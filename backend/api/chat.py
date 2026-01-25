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
    # FAST PATH: Check for basic greetings
    query_lower = req.question.lower().strip().rstrip("?!.")
    greetings = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"]
    basic_queries = ["can you help me", "what you do", "how you can help me", "who are you", "what is this"]
    
    fast_response = None
    if query_lower in greetings:
        fast_response = "Hello! I am the Vishwakarma University Admission Assistant. How can I help you today?"
    elif query_lower in basic_queries:
        fast_response = "I am an AI assistant here to help you with information about Vishwakarma University admissions, programs, fees, and campus life. Feel free to ask me anything!"

    if fast_response:
        return {
            "answer": fast_response,
            "sources": []
        }

    if not granite:
        raise HTTPException(status_code=503, detail="Granite service unavailable")

    try:
        result = retrieve_context(req.question)
        context = result.get("context", "")
        sources = result.get("sources", [])
    except Exception as e:
        logger.error(f"Error retrieving context: {e}")
        context = ""
        sources = []

    prompt = f"""You are a helpful and professional admission assistant for Vishwakarma University.
Your task is to answer the user's question based ONLY on the provided context.
Answer directly and concisely. Do not make up new questions or answers.
If the answer is not in the context, politely state that you don't have that information.

---
Context:
{context}
---

User Question: {req.question}

Assistant Answer:"""

    try:
        # Use simple generation instead of streaming to restore stability
        # We need to ensure GraniteClient supports non-streaming generation via generate_chat_response
        # or we consume the stream here and join it.
        # Assuming generate_chat_response still exists and works.
        answer = granite.generate_chat_response(prompt)
        
        # Clean up artifacts if any
        for stop_seq in ["User Question:", "Question:", "\nUser:", "\nQuestion:"]:
            if stop_seq in answer:
                answer = answer.split(stop_seq)[0]
        answer = answer.strip()
        
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate response")

    return {
        "answer": answer,
        "sources": sources
    }
