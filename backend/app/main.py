from fastapi import FastAPI

from app.api.analyze import router as analyze_router
from app.api.auth import router as auth_router
from app.api.uploads import router as uploads_router

app = FastAPI(title="BrudWawa API")

app.include_router(auth_router)
app.include_router(uploads_router)
app.include_router(analyze_router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
