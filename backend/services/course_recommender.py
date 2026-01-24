def recommend_courses(eligibility_text: str) -> list[str]:
    """
    Basic rule-based course recommendation.
    Can be enhanced later with ML.
    """
    courses = []

    text = eligibility_text.lower()

    if "math" in text or "physics" in text:
        courses.append("B.Tech / Engineering")

    if "biology" in text:
        courses.append("Medical / Life Sciences")

    if "commerce" in text or "accounts" in text:
        courses.append("B.Com / Business Studies")

    if not courses:
        courses.append("General Arts / Humanities")

    return courses
