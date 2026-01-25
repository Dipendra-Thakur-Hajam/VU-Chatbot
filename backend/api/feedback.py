from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
import json
from pathlib import Path

router = APIRouter()

# Create feedback directory and file
FEEDBACK_DIR = Path("data/feedback")
FEEDBACK_DIR.mkdir(parents=True, exist_ok=True)
FEEDBACK_FILE = FEEDBACK_DIR / "feedback.jsonl"


class FeedbackRequest(BaseModel):
    messageId: str
    feedbackType: str  # "like" or "dislike"
    question: str
    answer: str


@router.post("/feedback")
def submit_feedback(req: FeedbackRequest):
    """Store user feedback for analytics and model improvement"""
    
    feedback_data = {
        "message_id": req.messageId,
        "feedback_type": req.feedbackType,
        "question": req.question,
        "answer": req.answer,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # Append to JSONL file (one JSON object per line)
    try:
        with open(FEEDBACK_FILE, "a") as f:
            f.write(json.dumps(feedback_data) + "\n")
        
        return {"status": "success", "message": "Feedback recorded"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
