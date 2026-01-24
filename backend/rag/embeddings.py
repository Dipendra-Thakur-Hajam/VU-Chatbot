
from backend.granite.granite_client import GraniteClient

granite = GraniteClient()


def get_embedding(text: str) -> list[float]:
    """
    Generate embedding for a given text using IBM Granite
    """
    return granite.generate_embedding(text)
