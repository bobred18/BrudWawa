from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.report import Report, ReportStatus

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("")
async def get_stats(db: AsyncSession = Depends(get_db)):
    # per kategoria
    category_result = await db.execute(
        select(Report.category, func.count(Report.id).label("count"))
        .where(Report.status == ReportStatus.approved)
        .group_by(Report.category)
        .order_by(func.count(Report.id).desc())
    )
    by_category = [{"category": row.category, "count": row.count} for row in category_result]

    # per status
    total_result = await db.execute(
        select(Report.status, func.count(Report.id).label("count"))
        .group_by(Report.status)
    )
    by_status = {row.status.value: row.count for row in total_result}

    return {
        "by_category": by_category,
        "by_status": by_status,
        "total": sum(by_status.values()),
    }
