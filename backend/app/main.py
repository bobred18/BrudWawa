from fastapi import FastAPI

from app.api.admin import router as admin_router
from app.api.stats import router as stats_router
from app.api.websocket import router as ws_router
from app.api.analyze import router as analyze_router
from app.api.auth import router as auth_router
from app.api.comments import router as comments_router
from app.api.reports import router as reports_router
from app.api.uploads import router as uploads_router
from app.api.votes import router as votes_router

app = FastAPI(title="BrudWawa API")

app.include_router(auth_router)
app.include_router(uploads_router)
app.include_router(analyze_router)
app.include_router(reports_router)
app.include_router(comments_router)
app.include_router(votes_router)
app.include_router(admin_router)
app.include_router(stats_router)
app.include_router(ws_router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
