from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router
from app.routers.eligibility import router as eligibility_router
from app.routers.documents import router as documents_router
from app.routers.stripe import router as stripe_router

__all__ = [
    "auth_router", "profile_router", "eligibility_router",
    "documents_router", "stripe_router",
]
