"""Eligibility Result Pydantic Schemas."""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Any
from pydantic import BaseModel, Field


class CriterionScore(BaseModel):
    criterion_id: str
    criterion_name: str
    score: float = Field(..., ge=0, le=100)
    max_score: float = 100.0
    met: bool
    evidence_summary: str
    recommendations: list[str]


class LLCAssessment(BaseModel):
    eligible: bool
    entity_type: str | None = None
    has_governance: bool = False
    employer_employee_relationship: bool = False
    recommendations: list[str]
    alternative_route: str | None = None


class EligibilityRequest(BaseModel):
    profile_id: uuid.UUID


class EligibilityResponse(BaseModel):
    id: uuid.UUID
    profile_id: uuid.UUID
    visa_category: str
    overall_score: Decimal
    criteria_met: int
    criteria_required: int
    criteria_scores: list[CriterionScore]
    recommendations: list[str]
    llc_assessment: LLCAssessment | None = None
    engine_version: str
    created_at: datetime
    status: str  # "strong", "moderate", "weak", "insufficient"

    model_config = {"from_attributes": True}
