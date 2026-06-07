import io

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from PIL import Image, ImageOps

from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.storage import upload_image

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB

_PIL_FORMAT = {"image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WEBP"}

router = APIRouter(prefix="/api/uploads", tags=["uploads"])


def _auto_orient(data: bytes, content_type: str) -> bytes:
    # Rotate pixel data to match EXIF orientation, then strip the tag so
    # browsers don't double-rotate.
    img = Image.open(io.BytesIO(data))
    img = ImageOps.exif_transpose(img)
    out = io.BytesIO()
    save_kwargs = {"format": _PIL_FORMAT[content_type]}
    if content_type == "image/jpeg":
        save_kwargs["quality"] = 95
    img.save(out, **save_kwargs)
    return out.getvalue()


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

    data = _auto_orient(data, file.content_type)
    key = upload_image(data, file.content_type)
    return {"key": key}
