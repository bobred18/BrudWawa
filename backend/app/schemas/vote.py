from pydantic import BaseModel, field_validator


class VoteCreate(BaseModel):
    value: int

    @field_validator("value")
    @classmethod
    def validate_value(cls, v: int) -> int:
        if v not in (1, -1):
            raise ValueError("Vote value must be 1 or -1")
        return v


class VoteResponse(BaseModel):
    user_id: int
    report_id: int
    value: int

    model_config = {"from_attributes": True}
