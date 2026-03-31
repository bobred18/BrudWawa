from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.report import Report
from app.models.user import User
from app.models.vote import Vote
from app.schemas.vote import VoteCreate, VoteResponse

router = APIRouter(prefix="/api/reports", tags=["votes"])


@router.post("/{report_id}/vote", response_model=VoteResponse)
async def vote(
    report_id: int,
    body: VoteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    report = await db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    existing = await db.scalar(
        select(Vote).where(Vote.user_id == current_user.id, Vote.report_id == report_id)
    )

    if existing:
        if existing.value == body.value:
            # cofnięcie głosu
            await db.delete(existing)
            await db.commit()
            raise HTTPException(status_code=204, detail="Vote removed")
        else:
            # zmiana głosu
            existing.value = body.value
            await db.commit()
            await db.refresh(existing)
            return existing
    else:
        vote = Vote(user_id=current_user.id, report_id=report_id, value=body.value)
        db.add(vote)
        await db.commit()
        await db.refresh(vote)
        return vote


@router.get("/{report_id}/votes")
async def get_votes(
    report_id: int,
    db: AsyncSession = Depends(get_db),
):
    report = await db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    result = await db.execute(select(Vote).where(Vote.report_id == report_id))
    votes = result.scalars().all()

    score = sum(v.value for v in votes)
    return {"report_id": report_id, "score": score, "count": len(votes)}
