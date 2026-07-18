"""CORS configuration driven by the CORS_ORIGINS setting."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from utils.config import settings


def setup_cors(app: FastAPI) -> None:
    """Attach CORSMiddleware using origins from settings."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
