"""Dhrishta Healthcare Services API — FastAPI application entry point.

Run with: uvicorn server:app --host 0.0.0.0 --port 8000
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from middleware import RateLimitMiddleware, register_error_handlers, setup_cors
from routes import (
    admin,
    auth,
    bookings,
    chat,
    contact,
    email,
    gallery,
    packages,
    payments,
    services,
    sms,
    staff,
    testimonials,
    whatsapp,
)
from utils import constants, database

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

API_VERSION = "1.0.0"


async def _bootstrap_admin_user() -> None:
    """Create the first admin account when the users collection is empty.

    Guarantees the portal is usable straight after `docker compose up` without
    running the seed script. Credentials come from ADMIN_EMAIL /
    SEED_ADMIN_PASSWORD env vars (see .env.example); the default password is
    logged with a change-it warning.
    """
    from utils.auth_utils import hash_password
    from utils.config import settings
    from utils.helpers import utcnow

    db = database.get_db()
    if await db.users.count_documents({}) > 0:
        return
    email = settings.admin_email.lower()
    await db.users.insert_one(
        {
            "email": email,
            "password": hash_password(settings.seed_admin_password),
            "role": "admin",
            "name": "Dhrishta Admin",
            "phone": "",
            "created_at": utcnow(),
            "last_login": None,
            "is_active": True,
        }
    )
    logger.info("Bootstrapped first admin user: %s", email)
    if settings.seed_admin_password == "ChangeMe@123":
        logger.warning(
            "Admin uses the DEFAULT password 'ChangeMe@123'. "
            "Set SEED_ADMIN_PASSWORD and change it immediately."
        )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Log DB reachability on startup (lazy client — server starts regardless)."""
    if await database.ping():
        logger.info("MongoDB reachable.")
        try:
            await _bootstrap_admin_user()
        except Exception as exc:  # noqa: BLE001 - never block startup on bootstrap
            logger.warning("Admin bootstrap skipped: %s", exc)
    else:
        logger.warning("MongoDB not reachable at startup; requests will retry lazily.")
    yield
    await database.close()


def create_app() -> FastAPI:
    """Build the FastAPI app: middleware, error handlers and all routers."""
    app = FastAPI(
        title=f"{constants.COMPANY_NAME} API",
        description="Backend API for the Dhrishta Healthcare Services website.",
        version=API_VERSION,
        lifespan=lifespan,
    )

    setup_cors(app)
    app.add_middleware(RateLimitMiddleware)
    register_error_handlers(app)

    # Public routers under /api
    for public_router in (
        auth.router,
        services.router,
        packages.router,
        bookings.router,
        contact.router,
        gallery.router,
        staff.router,          # public /team endpoints
        testimonials.router,
        chat.router,
        payments.router,
        whatsapp.router,
        sms.router,            # /notifications/sms
        email.router,          # /notifications/email
    ):
        app.include_router(public_router, prefix="/api")

    # Admin router (JWT-protected) under /api/admin
    app.include_router(admin.router, prefix="/api")

    @app.get("/api/health", tags=["meta"])
    async def health() -> dict:
        """Liveness + DB connectivity check."""
        return {"status": "ok", "db": await database.ping()}

    @app.get("/", tags=["meta"])
    async def root() -> dict:
        """Basic service info."""
        return {
            "service": f"{constants.COMPANY_NAME} API",
            "version": API_VERSION,
            "docs": "/docs",
            "health": "/api/health",
        }

    return app


app = create_app()
