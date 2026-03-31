from datetime import datetime

from pydantic import BaseModel

from app.models.report import ReportStatus


class ReportCreate(BaseModel):
    title: str
    description: str
    category: str
    threat_level: int
    suggested_service: str | None = None
    image_key: str | None = None
    latitude: float
    longitude: float


class ReportUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    threat_level: int | None = None
    suggested_service: str | None = None


class ReportResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    category: str
    threat_level: int
    suggested_service: str | None
    status: ReportStatus
    image_key: str | None
    latitude: float
    longitude: float
    district: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
