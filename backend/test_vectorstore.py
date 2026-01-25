"""
Quick test script to verify vector store loads correctly
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.rag.vector_store import VectorStore
from backend.rag.retriever import retrieve_context

print("=" * 60)
print("Testing Vector Store Fix")
print("=" * 60)

# Test 1: Check if vector store initializes
print("\n1. Initializing VectorStore...")
try:
    vs = VectorStore()
    if vs.store is None:
        print("   ❌ FAILED: Vector store is None")
        print("   The FAISS index was not found or failed to load")
    else:
        print("   ✅ SUCCESS: Vector store loaded successfully")
        print(f"   Vector store type: {type(vs.store)}")
except Exception as e:
    print(f"   ❌ ERROR: {e}")

# Test 2: Try to retrieve context
print("\n2. Testing context retrieval...")
try:
    result = retrieve_context("What programs does VU offer?")
    context = result.get("context", "")
    sources = result.get("sources", [])
    
    if not context:
        print("   ❌ FAILED: No context retrieved")
    else:
        print("   ✅ SUCCESS: Context retrieved")
        print(f"   Context length: {len(context)} characters")
        print(f"   Number of sources: {len(sources)}")
        print(f"\n   First 200 chars of context:")
        print(f"   {context[:200]}...")
        
        if sources:
            print(f"\n   Sources:")
            for i, src in enumerate(sources[:3], 1):
                print(f"   {i}. {src.get('category', 'N/A')}: {src.get('filename', 'N/A')}")
except Exception as e:
    print(f"   ❌ ERROR: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("Test Complete")
print("=" * 60)
