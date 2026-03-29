from fastapi import FastAPI

from app.api.auth import router as auth_router

app = FastAPI(title="BrudWawa API")

app.include_router(auth_router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
