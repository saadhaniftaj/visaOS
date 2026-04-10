"""Vanguard Visa Platform — Configuration via Pydantic Settings."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://visa_admin:visa_secret_2026@localhost:5432/visa_platform"

    # JWT
    JWT_SECRET_KEY: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Stripe (DISABLED for MVP)
    STRIPE_ENABLED: bool = False
    STRIPE_SECRET_KEY: str = "sk_test_placeholder"

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"

    # App
    APP_NAME: str = "Vanguard Visa Platform"
    APP_VERSION: str = "1.0.0-mvp"
    ENGINE_VERSION: str = "2026.1"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
