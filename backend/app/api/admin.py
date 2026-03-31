from fastapi import APIRouter, Depends, HTTPException
from geoalchemy2.functions import ST_AsText
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_admin
from app.db.session import get_db
from app.models.report import Report, ReportStatus
from app.models.user import User
from app.schemas.report import ReportResponse, ReportUpdate

router = APIRouter(prefix="/api/admin", tags=["admin"])


def parse_location(wkt: str) -> tuple[float, float]:
    coords = wkt.replace("POINT(", "").replace(")", "").split()
    return float(coords[1]), float(coords[0])


@router.get("/reports", response_model=list[ReportResponse])
async def list_pending(
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Report).where(Report.status == ReportStatus.pending).order_by(Report.created_at)
    )
    reports = result.scalars().all()

    rows = []
    for r in reports:
        wkt = await db.scalar(ST_AsText(r.location))
        lat, lon = parse_location(wkt)
        rows.append({**r.__dict__, "latitude": lat, "longitude": lon})
    return rows


@router.patch("/reports/{report_id}", response_model=ReportResponse)
async def update_report(
    report_id: int,
    body: ReportUpdate,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    report = await db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(report, field, value)

    await db.commit()
    await db.refresh(report)

    wkt = await db.scalar(ST_AsText(report.location))
    lat, lon = parse_location(wkt)
    return {**report.__dict__, "latitude": lat, "longitude": lon}


@router.post("/reports/{report_id}/approve", response_model=ReportResponse)
async def approve_report(
    report_id: int,
    body: ReportUpdate = None,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    report = await db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if body:
        for field, value in body.model_dump(exclude_none=True).items():
            setattr(report, field, value)

    report.status = ReportStatus.approved
    await db.commit()
    await db.refresh(report)
    wkt = await db.scalar(ST_AsText(report.location))
    lat, lon = parse_location(wkt)
    return {**report.__dict__, "latitude": lat, "longitude": lon}


@router.post("/reports/{report_id}/reject", response_model=ReportResponse)
async def reject_report(
    report_id: int,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    report = await db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = ReportStatus.rejected
    await db.commit()
    await db.refresh(report)
    wkt = await db.scalar(ST_AsText(report.location))
    lat, lon = parse_location(wkt)
    return {**report.__dict__, "latitude": lat, "longitude": lon}


@router.post("/reports/{report_id}/resolve", response_model=ReportResponse)
async def resolve_report(
    report_id: int,
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    report = await db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = ReportStatus.resolved
    await db.commit()
    await db.refresh(report)
    wkt = await db.scalar(ST_AsText(report.location))
    lat, lon = parse_location(wkt)
    return {**report.__dict__, "latitude": lat, "longitude": lon}
