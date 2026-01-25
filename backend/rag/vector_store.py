from pathlib import Path
from typing import List

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from backend.granite.granite_client import granite_embeddings

VECTOR_DIR = Path("data/VectorStore")
VECTOR_DIR.mkdir(parents=True, exist_ok=True)


class VectorStore:
    def __init__(self):
        self.index_path = VECTOR_DIR
        self.index_name = "index"

        if (self.index_path / "index.faiss").exists():
            self.store = FAISS.load_local(
                self.index_path,
                embeddings=granite_embeddings,
                index_name=self.index_name,
                allow_dangerous_deserialization=True,
            )
        else:
            self.store = None

    def add_documents(self, documents: List[Document], embeddings):
        if self.store is None:
            self.store = FAISS.from_documents(documents, embeddings)
        else:
            self.store.embedding_function = embeddings
            self.store.add_documents(documents)

    def save(self):
        if self.store is None:
            raise RuntimeError("Cannot save empty FAISS index")

        self.store.save_local(
            self.index_path,
            index_name=self.index_name,
        )

    def similarity_search(self, query: str, k: int = 4):
        if self.store is None:
            raise RuntimeError("FAISS index not initialized")

        return self.store.similarity_search(query, k=k)
