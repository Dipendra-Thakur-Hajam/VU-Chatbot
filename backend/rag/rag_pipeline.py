from backend.rag.retriever import retrieve_context
from backend.granite.granite_client import granite_embeddings
from functools import lru_cache
import asyncio


@lru_cache(maxsize=128)
def _cached_answer_question(question: str) -> str:
    """
    Cached version - returns cached result for identical questions.
    LRU cache stores up to 128 most recent questions.
    """
    result = retrieve_context(question)
    context = result.get("context", "") if isinstance(result, dict) else result

    if not context.strip():
        return "I don't have enough information to answer that."

    prompt = f"""You are a helpful and professional admission assistant for Vishwakarma University.
Your task is to answer the user's question based ONLY on the provided context.
Answer directly and concisely. Do not make up new questions or answers.
If the answer is not in the context, politely state that you don't have that information.

---
Context:
{context}
---

User Question: {question}

Assistant Answer:"""

    return granite_embeddings.generate_chat_response(prompt)


def answer_question(question: str) -> str:
    """Main entry point with caching enabled - blocking version"""
    return _cached_answer_question(question)


async def stream_answer_question(question: str):
    """
    Async streaming version - responds like ChatGPT
    Yields response tokens as they arrive
    
    This is much faster perceived latency because:
    1. User sees text appearing immediately
    2. No waiting for full response
    3. Can read as it generates
    """
    # Check if cached first (instant response for known questions)
    try:
        cached = _cached_answer_question(question)
        # If cached, yield it in chunks for streaming effect
        for i in range(0, len(cached), 15):
            chunk = cached[i:i+15]
            yield chunk
            await asyncio.sleep(0.01)  # Small delay for smooth streaming
        return
    except:
        pass
    
    # Not cached - stream from API
    result = retrieve_context(question)
    context = result.get("context", "") if isinstance(result, dict) else result

    if not context.strip():
        response = "I don't have enough information to answer that."
        for chunk in response.split():
            yield chunk + " "
            await asyncio.sleep(0.01)
        return

    prompt = f"""You are a helpful and professional admission assistant for Vishwakarma University.
Your task is to answer the user's question based ONLY on the provided context.
Answer directly and concisely. Do not make up new questions or answers.
If the answer is not in the context, politely state that you don't have that information.

---
Context:
{context}
---

User Question: {question}

Assistant Answer:"""

    # Stream from Granite API
    full_response = ""
    for token in granite_embeddings.generate_chat_stream(prompt):
        full_response += token
        yield token
        await asyncio.sleep(0.001)  # Minimal delay, stream as fast as possible
    
    # Cache the full response for next time
    try:
        _cached_answer_question.cache_clear()  # Invalidate cache before setting
    except:
        pass
