from fastapi import APIRouter, HTTPException

from app.services.storage import get_public_url

router = APIRouter(prefix="/api/images", tags=["images"])


@router.get("/{key}")
async def get_image_url(key: str):
    if not key or "/" in key:
        raise HTTPException(status_code=400, detail="Invalid key")
    return {"url": get_public_url(key)}
