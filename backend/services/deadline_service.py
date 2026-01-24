import re


def extract_deadlines(text: str) -> list[str]:
    """
    Extract common deadline patterns from admission text
    """
    pattern = r"(\\b\\d{1,2}\\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s\\d{4}\\b)"
    return re.findall(pattern, text)
