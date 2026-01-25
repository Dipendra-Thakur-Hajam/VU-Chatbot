from pathlib import Path
from backend.rag.document_ingestion import ingest_all_documents

DATA_DIR = Path("backend/data")


def run():
    ingest_all_documents(DATA_DIR)
    print("✅ FAISS index created successfully")


if __name__ == "__main__":
    run()
