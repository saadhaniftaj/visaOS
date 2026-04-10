"""Profile & Questionnaire Pydantic Schemas."""
import uuid
from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


class QuestionnaireStepData(BaseModel):
    step: int = Field(..., ge=1, le=10)
    data: dict[str, Any]


class ProfileCreate(BaseModel):
    visa_category: str = Field(..., pattern="^(O1A|E2)$")


class ProfileResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    version: int
    visa_category: str
    questionnaire_data: dict[str, Any]
    questionnaire_step: int
    is_complete: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProfileListResponse(BaseModel):
    profiles: list[ProfileResponse]
    total: int
