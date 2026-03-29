from sqlalchemy import DateTime, ForeignKey, Integer, SmallInteger, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Vote(Base):
    __tablename__ = "votes"

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    report_id: Mapped[int] = mapped_column(Integer, ForeignKey("reports.id", ondelete="CASCADE"), primary_key=True)
    value: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
