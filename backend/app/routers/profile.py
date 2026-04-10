"""Profile Router — CRUD for visa profiles and questionnaire data."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.models.profile import VisaProfile
from app.schemas.profile import (
    ProfileCreate, ProfileResponse, ProfileListResponse, QuestionnaireStepData
)
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/profiles", tags=["Profiles"])


@router.post("/", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(
    payload: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new visa profile (auto-increments version)."""
    # Get the latest version number for this user
    result = await db.execute(
        select(func.max(VisaProfile.version))
        .where(VisaProfile.user_id == current_user.id)
    )
    max_version = result.scalar() or 0

    profile = VisaProfile(
        user_id=current_user.id,
        visa_category=payload.visa_category,
        version=max_version + 1,
        questionnaire_data={},
        questionnaire_step=1,
    )
    db.add(profile)
    await db.flush()
    await db.refresh(profile)
    return profile


@router.get("/", response_model=ProfileListResponse)
async def list_profiles(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all visa profiles for the authenticated user."""
    result = await db.execute(
        select(VisaProfile)
        .where(VisaProfile.user_id == current_user.id)
        .order_by(VisaProfile.created_at.desc())
    )
    profiles = result.scalars().all()
    return ProfileListResponse(profiles=profiles, total=len(profiles))


@router.get("/{profile_id}", response_model=ProfileResponse)
async def get_profile(
    profile_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific visa profile."""
    import uuid
    try:
        pid = uuid.UUID(profile_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid profile ID")

    result = await db.execute(
        select(VisaProfile)
        .where(VisaProfile.id == pid, VisaProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/{profile_id}/step", response_model=ProfileResponse)
async def update_questionnaire_step(
    profile_id: str,
    payload: QuestionnaireStepData,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update questionnaire data for a specific step (auto-save)."""
    import uuid
    try:
        pid = uuid.UUID(profile_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid profile ID")

    result = await db.execute(
        select(VisaProfile)
        .where(VisaProfile.id == pid, VisaProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Merge step data into the JSONB questionnaire_data
    step_key = f"step_{payload.step}"
    current_data = dict(profile.questionnaire_data) if profile.questionnaire_data else {}
    current_data[step_key] = payload.data
    profile.questionnaire_data = current_data

    # Advance step tracker
    if payload.step >= profile.questionnaire_step:
        profile.questionnaire_step = payload.step + 1

    # Mark complete if step 10
    if payload.step >= 10:
        profile.is_complete = True
        profile.questionnaire_step = 10

    await db.flush()
    await db.refresh(profile)
    return profile


@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(
    profile_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a visa profile."""
    import uuid
    try:
        pid = uuid.UUID(profile_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid profile ID")

    result = await db.execute(
        select(VisaProfile)
        .where(VisaProfile.id == pid, VisaProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    await db.delete(profile)
    return None
