from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from app.db.session import get_db
from app.models.user import User

router = APIRouter(prefix="/api/users", tags=["users"])


class PublicUserResponse(BaseModel):
    id: int
    email: str
    display_name: str | None

    model_config = {"from_attributes": True}


@router.get("/{user_id}", response_model=PublicUserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
