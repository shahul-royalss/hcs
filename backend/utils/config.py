"""Application settings loaded from environment variables via pydantic-settings."""

import logging
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

_DEV_JWT_SECRET = "dev-insecure-jwt-secret-change-me"


class Settings(BaseSettings):
    """Environment-driven configuration. See .env.example for documentation."""

    # Database
    mongo_url: str = "mongodb://localhost:27017"
    db_name: str = "dhrishta_healthcare"

    # Auth / JWT
    jwt_secret: str = _DEV_JWT_SECRET
    jwt_expires_minutes: int = 1440
    jwt_algorithm: str = "HS256"

    # Payments (Stripe)
    stripe_secret_key: str = ""

    # Twilio (SMS + WhatsApp)
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_whatsapp_number: str = ""
    twilio_sms_number: str = ""

    # Email (Resend)
    resend_api_key: str = ""

    # AI chatbot (Anthropic Messages API)
    ai_model_api_key: str = ""
    ai_model: str = "claude-sonnet-4-5"

    # CORS (comma-separated origins)
    cors_origins: str = "http://localhost:3000"

    # First admin account (auto-created at startup when no users exist)
    admin_email: str = "admin@dhrishta.com"
    seed_admin_password: str = "ChangeMe@123"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        """CORS origins as a cleaned list."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return the cached settings instance, warning about insecure defaults."""
    settings = Settings()
    if settings.jwt_secret == _DEV_JWT_SECRET:
        logger.warning(
            "JWT_SECRET is using the insecure development default. "
            "Set JWT_SECRET in the environment before deploying to production."
        )
    return settings


settings = get_settings()
