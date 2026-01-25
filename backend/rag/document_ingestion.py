# backend/rag/document_ingestion.py

from pathlib import Path
from langchain_core.documents import Document
from backend.granite.granite_client import granite_embeddings
from backend.rag.vector_store import VectorStore
from backend.rag.chunking import chunk_text

DATA_DIR = Path("backend/data")


def ingest_document(file_path: str):
    vector_store = VectorStore()

    text = Path(file_path).read_text(encoding="utf-8")
    chunks = chunk_text(text)

    documents = []
    for chunk in chunks:
        documents.append(Document(page_content=chunk))

    vector_store.add_documents(documents, granite_embeddings)
    vector_store.save()


def ingest_all_documents(data_dir: Path = DATA_DIR):
    vector_store = VectorStore()

    for file in data_dir.glob("**/*.txt"):
        text = file.read_text(encoding="utf-8")
        chunks = chunk_text(text)

        documents = [Document(page_content=c) for c in chunks]
        vector_store.add_documents(documents, granite_embeddings)

    vector_store.save()
