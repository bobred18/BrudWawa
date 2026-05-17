from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from minio.error import S3Error

from app.services.storage import download_image

router = APIRouter(prefix="/api/images", tags=["images"])


@router.get("/{key}")
async def get_image(key: str):
    if not key or "/" in key:
        raise HTTPException(status_code=400, detail="Invalid key")
    try:
        data, content_type = download_image(key)
    except S3Error:
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(
        content=data,
        media_type=content_type,
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )
