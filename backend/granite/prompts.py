SYSTEM_PROMPT = """
You are a College Admission Assistant.
Answer ONLY using the provided context.
If the answer is not found, say:
"This information is not available in the official admission documents."
Always be accurate and concise.
"""

def build_prompt(context: str, question: str) -> str:
    return f"""
{SYSTEM_PROMPT}

Context:
{context}

Question:
{question}

Answer:
"""
