from fastapi import APIRouter, UploadFile, File
from pathlib import Path
import shutil

from backend.rag.document_ingestion import ingest_single_document
from backend.rag.vector_store import VectorStore

router = APIRouter()


@router.post("/ingest")
def ingest(file: UploadFile = File(...)):
    upload_dir = Path("data/processed")
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    vector_store = VectorStore()
    ingest_single_document(file_path, vector_store)
    vector_store.save()

    return {"status": "Document ingested successfully"}
