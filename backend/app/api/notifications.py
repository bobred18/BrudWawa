from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.dependencies import get_current_admin
from app.models.user import User
from app.services.firebase import send_broadcast

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


class NotificationRequest(BaseModel):
    title: str
    body: str


@router.post("")
async def broadcast_notification(
    body: NotificationRequest,
    current_admin: User = Depends(get_current_admin),
):
    try:
        message_id = send_broadcast(body.title, body.body)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"FCM error: {e}")

    return {"message_id": message_id}
