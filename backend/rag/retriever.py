from backend.rag.vector_store import VectorStore
from backend.granite.granite_client import granite_embeddings


vector_store = VectorStore()


def retrieve_context(question: str, k: int = 4):
    """
    Retrieve context and source information for a question.
    Returns a dict with 'context' (string) and 'sources' (list of dicts).
    """
    if vector_store.store is None:
        return {"context": "", "sources": []}

    docs = vector_store.similarity_search(question, k=k)
    
    # Extract context text
    context = "\n\n".join(doc.page_content for doc in docs)
    
    # Extract source information
    sources = []
    for doc in docs:
        # Get metadata from document
        metadata = doc.metadata if hasattr(doc, 'metadata') else {}
        source_name = metadata.get('source', 'Unknown')
        
        # Extract category from path (e.g., "backend/data/fees/tuition_fees.txt" -> "fees")
        path_parts = source_name.split('/')
        category = path_parts[-2] if len(path_parts) >= 2 else "general"
        filename = path_parts[-1] if path_parts else source_name
        
        sources.append({
            "category": category.title(),
            "filename": filename.replace('.txt', '').replace('_', ' ').title(),
            "snippet": doc.page_content[:150] + "..." if len(doc.page_content) > 150 else doc.page_content
        })
    
    return {"context": context, "sources": sources}
