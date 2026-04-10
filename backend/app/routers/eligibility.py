"""Eligibility Router — Run the evaluation engine."""
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.models.profile import VisaProfile, EligibilityResult
from app.schemas.eligibility import EligibilityRequest, EligibilityResponse
from app.services.eligibility_service import EligibilityService
from app.middleware.auth_middleware import get_current_user
from app.config import get_settings

router = APIRouter(prefix="/eligibility", tags=["Eligibility"])
settings = get_settings()


@router.post("/evaluate", status_code=status.HTTP_200_OK)
async def evaluate_eligibility(
    payload: EligibilityRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Run the eligibility engine on a completed profile."""
    # Fetch the profile
    result = await db.execute(
        select(VisaProfile).where(
            VisaProfile.id == payload.profile_id,
            VisaProfile.user_id == current_user.id,
        )
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if not profile.is_complete:
        raise HTTPException(
            status_code=400,
            detail="Questionnaire must be completed before evaluation",
        )

    # Run the engine
    service = EligibilityService()
    eval_result = service.evaluate(
        profile_id=profile.id,
        user_id=current_user.id,
        visa_category=profile.visa_category,
        questionnaire_data=profile.questionnaire_data,
    )

    # Persist result
    db_result = EligibilityResult(
        profile_id=profile.id,
        user_id=current_user.id,
        visa_category=profile.visa_category,
        overall_score=eval_result["overall_score"],
        criteria_scores=eval_result["criteria_scores"],
        recommendations=eval_result["recommendations"],
        llc_assessment=eval_result.get("llc_assessment"),
        engine_version=settings.ENGINE_VERSION,
    )
    db.add(db_result)
    await db.flush()
    await db.refresh(db_result)

    return {
        "id": db_result.id,
        "profile_id": db_result.profile_id,
        "visa_category": db_result.visa_category,
        "overall_score": float(db_result.overall_score),
        "criteria_met": eval_result["criteria_met"],
        "criteria_required": eval_result["criteria_required"],
        "criteria_scores": eval_result["criteria_scores"],
        "recommendations": eval_result["recommendations"],
        "llc_assessment": eval_result.get("llc_assessment"),
        "engine_version": db_result.engine_version,
        "created_at": db_result.created_at.isoformat(),
        "status": eval_result["status"],
    }


@router.get("/results/{profile_id}")
async def get_results(
    profile_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all eligibility results for a profile."""
    try:
        pid = uuid.UUID(profile_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid profile ID")

    result = await db.execute(
        select(EligibilityResult)
        .where(
            EligibilityResult.profile_id == pid,
            EligibilityResult.user_id == current_user.id,
        )
        .order_by(EligibilityResult.created_at.desc())
    )
    results = result.scalars().all()

    return [
        {
            "id": r.id,
            "profile_id": r.profile_id,
            "visa_category": r.visa_category,
            "overall_score": float(r.overall_score),
            "criteria_scores": r.criteria_scores,
            "recommendations": r.recommendations,
            "llc_assessment": r.llc_assessment,
            "engine_version": r.engine_version,
            "created_at": r.created_at.isoformat(),
        }
        for r in results
    ]
