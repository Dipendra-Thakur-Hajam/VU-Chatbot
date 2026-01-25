from backend.rag.retriever import retrieve_context
from backend.granite.granite_client import granite_embeddings


def answer_question(question: str) -> str:
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
