from fastapi import APIRouter, Depends, HTTPException, Query, status
from geoalchemy2.functions import ST_AsText, ST_MakePoint, ST_SetSRID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.report import Report, ReportStatus
from app.models.user import User
from app.schemas.report import ReportCreate, ReportResponse

router = APIRouter(prefix="/api/reports", tags=["reports"])


def parse_location(wkt: str) -> tuple[float, float]:
    # WKT format: POINT(lon lat)
    coords = wkt.replace("POINT(", "").replace(")", "").split()
    return float(coords[1]), float(coords[0])  # lat, lon


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    body: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    location = ST_SetSRID(ST_MakePoint(body.longitude, body.latitude), 4326)
    report = Report(
        user_id=current_user.id,
        title=body.title,
        description=body.description,
        category=body.category,
        threat_level=body.threat_level,
        suggested_service=body.suggested_service,
        image_key=body.image_key,
        location=location,
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)

    wkt = await db.scalar(ST_AsText(report.location))
    lat, lon = parse_location(wkt)

    return {**report.__dict__, "latitude": lat, "longitude": lon}


@router.get("", response_model=list[ReportResponse])
async def list_reports(
    category: str | None = Query(None),
    threat_level: int | None = Query(None),
    status: ReportStatus | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Report).where(Report.status == ReportStatus.approved)

    if category:
        query = query.where(Report.category == category)
    if threat_level:
        query = query.where(Report.threat_level == threat_level)
    if status:
        query = query.where(Report.status == status)

    result = await db.execute(query)
    reports = result.scalars().all()

    rows = []
    for r in reports:
        wkt = await db.scalar(ST_AsText(r.location))
        lat, lon = parse_location(wkt)
        rows.append({**r.__dict__, "latitude": lat, "longitude": lon})

    return rows


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
):
    report = await db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    wkt = await db.scalar(ST_AsText(report.location))
    lat, lon = parse_location(wkt)

    return {**report.__dict__, "latitude": lat, "longitude": lon}
