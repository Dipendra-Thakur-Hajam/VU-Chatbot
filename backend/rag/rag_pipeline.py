from backend.rag.retriever import retrieve_context
from backend.granite.granite_client import granite_embeddings


def answer_question(question: str) -> str:
    result = retrieve_context(question)
    context = result.get("context", "") if isinstance(result, dict) else result

    if not context.strip():
        return "I don't have enough information to answer that."

    prompt = f"""
You are a college admission assistant.
Answer ONLY using the context below.
If the answer is not in the context, say you don't know.

Context:
{context}

Question:
{question}

Answer:
"""

    return granite_embeddings.generate_chat_response(prompt)
