"""
Test the chat API endpoint
"""
import requests
import json

API_URL = "http://localhost:8000/api/chat"

test_questions = [
    "What programs does Vishwakarma University offer?",
    "What are the admission requirements?",
    "Tell me about the fees",
]

print("=" * 60)
print("Testing VU Chatbot API")
print("=" * 60)

for i, question in enumerate(test_questions, 1):
    print(f"\n{i}. Question: {question}")
    print("-" * 60)
    
    try:
        response = requests.post(
            API_URL,
            json={"question": question},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            answer = data.get("answer", "No answer")
            sources = data.get("sources", [])
            
            print(f"Answer: {answer[:300]}...")
            if sources:
                print(f"\nSources ({len(sources)}):")
                for src in sources[:2]:
                    print(f"  - {src.get('category')}: {src.get('filename')}")
        else:
            print(f"ERROR: Status {response.status_code}")
            print(response.text[:200])
    except Exception as e:
        print(f"ERROR: {e}")

print("\n" + "=" * 60)
print("Test Complete")
print("=" * 60)
