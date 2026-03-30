from fastapi import APIRouter, Depends, HTTPException, UploadFile

from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.storage import upload_image

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB

router = APIRouter(prefix="/api/uploads", tags=["uploads"])


@router.post("")
async def upload(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG and WebP images are allowed")

    data = await file.read()
    if len(data) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large, max 10 MB")

    key = upload_image(data, file.content_type)
    return {"key": key}
