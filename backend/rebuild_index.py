"""
Rebuild the FAISS vector store from scratch
This script deletes the old index and creates a new one from all documents in data/
"""
import sys
from pathlib import Path
import shutil

# Add parent to path
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

from backend.rag.vector_store import VectorStore, VECTOR_DIR
from backend.rag.chunking import chunk_text
from backend.granite.granite_client import granite_embeddings
from langchain_core.documents import Document

def rebuild_vector_store():
    print("=" * 60)
    print("Rebuilding FAISS Vector Store")
    print("=" * 60)
    
    # Step 1: Remove old index
    print("\n1. Removing old index...")
    if VECTOR_DIR.exists():
        try:
            shutil.rmtree(VECTOR_DIR)
            print(f"   [OK] Deleted old index at {VECTOR_DIR}")
        except Exception as e:
            print(f"   [ERROR] Error deleting old index: {e}")
            return
    else:
        print(f"   [INFO] No existing index found at {VECTOR_DIR}")
    
    # Recreate the directory
    VECTOR_DIR.mkdir(parents=True, exist_ok=True)
    
    # Step 2: Find all documents
    print("\n2. Finding documents...")
    data_dir = Path(__file__).parent / "data"  # backend/data
    text_files = list(data_dir.glob("**/*.txt"))
    print(f"   Found {len(text_files)} text files")
    
    if not text_files:
        print("   [ERROR] No text files found! Cannot build index.")
        return
    
    # Step 3: Process and embed documents
    print("\n3. Processing documents and creating embeddings...")
    all_documents = []
    
    for i, file_path in enumerate(text_files, 1):
        try:
            print(f"   [{i}/{len(text_files)}] Processing: {file_path.relative_to(data_dir)}")
            text = file_path.read_text(encoding="utf-8")
            chunks = chunk_text(text)
            
            # Create documents with metadata
            for chunk in chunks:
                doc = Document(
                    page_content=chunk,
                    metadata={
                        "source": str(file_path.relative_to(data_dir).as_posix()),
                        "filename": file_path.name
                    }
                )
                all_documents.append(doc)
        except Exception as e:
            print(f"   [WARN] Error processing {file_path.name}: {e}")
    
    print(f"\n   Total chunks created: {len(all_documents)}")
    
    # Step 4: Create new vector store
    print("\n4. Creating FAISS index...")
    try:
        from langchain_community.vectorstores import FAISS
        
        vector_store = FAISS.from_documents(all_documents, granite_embeddings)
        vector_store.save_local(VECTOR_DIR, index_name="index")
        
        print(f"   [OK] FAISS index created successfully at {VECTOR_DIR}")
    except Exception as e:
        print(f"   [ERROR] Error creating FAISS index: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Step 5: Verify the index
    print("\n5. Verifying index...")
    try:
        test_vs = VectorStore()
        if test_vs.store is not None:
            test_results = test_vs.similarity_search("admission requirements", k=2)
            print(f"   [OK] Index verified! Retrieved {len(test_results)} test documents")
        else:
            print("   [ERROR] Verification failed: Could not load index")
    except Exception as e:
        print(f"   [WARN] Verification error: {e}")
    
    print("\n" + "=" * 60)
    print("Rebuild Complete!")
    print("=" * 60)

if __name__ == "__main__":
    rebuild_vector_store()

