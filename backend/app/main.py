from fastapi import FastAPI

app = FastAPI(title="BrudWawa API")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
