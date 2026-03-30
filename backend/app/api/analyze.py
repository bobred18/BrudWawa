from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.gemini import analyze_image
from app.services.storage import download_image

router = APIRouter(prefix="/api/reports", tags=["reports"])


class AnalyzeRequest(BaseModel):
    image_key: str


@router.post("/analyze")
async def analyze(
    body: AnalyzeRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        data, content_type = download_image(body.image_key)
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")

    try:
        analysis = await analyze_image(data, content_type)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini analysis failed: {e}")

    return analysis
