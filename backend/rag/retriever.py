from backend.rag.vector_store import VectorStore
from backend.granite.granite_client import granite_embeddings


vector_store = VectorStore()


def retrieve_context(question: str, k: int = 4) -> str:
    if vector_store.store is None:
        return ""

    docs = vector_store.similarity_search(question, k=k)

    return "\n\n".join(doc.page_content for doc in docs)
