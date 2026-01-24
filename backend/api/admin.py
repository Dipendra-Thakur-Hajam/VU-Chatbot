from fastapi import APIRouter, Depends
from backend.auth.dependencies import get_current_user

router = APIRouter()


@router.get("/admin/health")
def admin_health(user=Depends(get_current_user)):
    return {"status": "admin ok"}
