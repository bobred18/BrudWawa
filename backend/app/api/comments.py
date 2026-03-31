from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.comment import Comment
from app.models.report import Report
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentResponse

router = APIRouter(prefix="/api/reports", tags=["comments"])


@router.post("/{report_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def add_comment(
    report_id: int,
    body: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    report = await db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    comment = Comment(report_id=report_id, user_id=current_user.id, content=body.content)
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment


@router.get("/{report_id}/comments", response_model=list[CommentResponse])
async def list_comments(
    report_id: int,
    db: AsyncSession = Depends(get_db),
):
    report = await db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    result = await db.execute(select(Comment).where(Comment.report_id == report_id).order_by(Comment.created_at))
    return result.scalars().all()
