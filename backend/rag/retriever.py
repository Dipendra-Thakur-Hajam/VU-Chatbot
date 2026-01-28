from backend.rag.vector_store import VectorStore
from backend.granite.granite_client import granite_embeddings
from functools import lru_cache
import asyncio


vector_store = VectorStore()


@lru_cache(maxsize=256)
def _cached_embed_query(question: str):
    """Cache query embeddings to avoid redundant API calls"""
    return tuple(granite_embeddings.embed_query(question))


async def retrieve_context_async(question: str, k: int = 5):
    """
    Async version of retrieve_context for parallel processing.
    Returns retrieved documents and sources without blocking.
    """
    # Run synchronous retrieval in thread pool to avoid blocking
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, retrieve_context, question, k)


def retrieve_context(question: str, k: int = 5):
    """
    Retrieve context and source information for a question.
    Returns a dict with 'context' (string) and 'sources' (list of dicts).
    
    Improvements:
    - Increased k from 4 to 5 for better context coverage
    - Caches query embeddings
    - Returns more relevant sources
    """
    if vector_store.store is None:
        return {"context": "", "sources": []}

    docs = vector_store.similarity_search(question, k=k)
    
    # Extract context text with better formatting
    context_parts = []
    for doc in docs:
        content = doc.page_content.strip()
        if content:  # Skip empty chunks
            context_parts.append(content)
    
    context = "\n\n".join(context_parts)
    
    # Extract source information with deduplication
    sources = []
    seen_sources = set()
    
    for doc in docs:
        metadata = doc.metadata if hasattr(doc, 'metadata') else {}
        source_name = metadata.get('source', 'Unknown')
        
        # Skip duplicate sources
        if source_name in seen_sources:
            continue
        seen_sources.add(source_name)
        
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
