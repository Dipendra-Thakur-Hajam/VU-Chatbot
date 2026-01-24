from fastapi import FastAPI

from backend.config import settings
from backend.database import Base, engine

from backend.auth.routes import router as auth_router
from backend.api.query import router as query_router
from backend.api.ingest import router as ingest_router
from backend.api.admin import router as admin_router
from backend.api.chat import router as chat_router


# ✅ CREATE APP ONCE
app = FastAPI(title=settings.APP_NAME)

# ✅ Create DB tables
Base.metadata.create_all(bind=engine)

# ✅ Routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(query_router, prefix="/api", tags=["Query"])
app.include_router(ingest_router, prefix="/api", tags=["Ingest"])
app.include_router(admin_router, prefix="/api", tags=["Admin"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])


@app.get("/")
def root():
    return {"status": "College Admission Agent is running"}
