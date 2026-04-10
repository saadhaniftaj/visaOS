"""Stripe Router — DISABLED for MVP.

This module contains the scaffolded Stripe integration endpoints.
All endpoints return 503 (Service Unavailable) when STRIPE_ENABLED=false.
"""
from fastapi import APIRouter, HTTPException, status
from app.config import get_settings

router = APIRouter(prefix="/stripe", tags=["Stripe (Disabled)"])
settings = get_settings()


def _check_stripe_enabled():
    """Gate — raises 503 when Stripe is disabled."""
    if not settings.STRIPE_ENABLED:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment processing is not available in this version. All features are free.",
        )


@router.post("/create-checkout-session")
async def create_checkout_session():
    """Create a Stripe Checkout session for subscription upgrade."""
    _check_stripe_enabled()
    # Week 4 logic placeholder:
    # import stripe
    # stripe.api_key = settings.STRIPE_SECRET_KEY
    # session = stripe.checkout.Session.create(...)
    return {"message": "Stripe integration pending"}


@router.post("/webhook")
async def stripe_webhook():
    """Handle Stripe webhook events (subscription updates, payments)."""
    _check_stripe_enabled()
    return {"message": "Webhook handler pending"}


@router.get("/subscription-status")
async def get_subscription_status():
    """Check current user's subscription tier."""
    # Always return free tier when Stripe is disabled
    return {
        "tier": "free",
        "features": "all",
        "message": "All features are currently available for free.",
    }
