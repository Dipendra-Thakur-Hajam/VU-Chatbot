import time
import requests
from typing import List
from backend.config import settings


class GraniteClient:
    def __init__(self):
        self.base_url = settings.IBM_WATSONX_URL.rstrip("/")
        self.api_key = settings.IBM_CLOUD_API_KEY
        self.project_id = settings.IBM_PROJECT_ID

        self.embedding_url = (
            f"{self.base_url}/ml/v1/text/embeddings?version=2024-05-01"
        )

        self._access_token = None
        self._token_expiry = 0

    # ===============================
    # 1️⃣ GET IAM ACCESS TOKEN
    # ===============================
    def _get_iam_token(self) -> str:
        if self._access_token and time.time() < self._token_expiry:
            return self._access_token

        response = requests.post(
            "https://iam.cloud.ibm.com/identity/token",
            headers={
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data={
                "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                "apikey": self.api_key
            },
            timeout=30
        )

        response.raise_for_status()
        data = response.json()

        self._access_token = data["access_token"]
        self._token_expiry = time.time() + int(data["expires_in"]) - 60

        return self._access_token

    # ===============================
    # 2️⃣ GENERATE EMBEDDINGS
    # ===============================
    def generate_embedding(self, text: str):
        token = self._get_iam_token()

        payload = {
            "model_id": settings.GRANITE_EMBEDDING_MODEL,
            "inputs": [text],
            "project_id": self.project_id
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }

        response = requests.post(
            self.embedding_url,
            headers=headers,
            json=payload,
            timeout=60
        )

        if not response.ok:
            print("IBM RESPONSE:", response.text)

        response.raise_for_status()

        # print("DEBUG RESPONSE:", response.text)
        return response.json()["results"][0]["embedding"]

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [self.generate_embedding(text) for text in texts]

    def embed_query(self, text: str) -> List[float]:
        return self.generate_embedding(text)

    def __call__(self, text: str) -> List[float]:
        return self.embed_query(text)

    def generate_chat_response(self, prompt: str) -> str:
        token = self._get_iam_token()

        payload = {
            "model_id": settings.GRANITE_CHAT_MODEL,
            "input": prompt,
            "project_id": self.project_id,
            "parameters": {
                "temperature": 0.2,
                "max_new_tokens": 400
            }
        }

        response = requests.post(
            f"{self.base_url}/ml/v1/text/generation?version=2024-05-01",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=60
        )

        response.raise_for_status()
        return response.json()["results"][0]["generated_text"]


# Backward compatibility
granite_embeddings = GraniteClient()

