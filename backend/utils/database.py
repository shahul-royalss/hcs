"""Lazy MongoDB (motor) connection management.

The client is created on first use so the API server starts even when
MongoDB is unreachable; individual requests surface database errors instead.
"""

import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from utils.config import settings

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    """Return the shared motor client, creating it lazily (no I/O happens here)."""
    global _client
    if _client is None:
        logger.info("Creating MongoDB client for %s", settings.mongo_url)
        _client = AsyncIOMotorClient(
            settings.mongo_url,
            serverSelectionTimeoutMS=3000,
            uuidRepresentation="standard",
        )
    return _client


def get_db() -> AsyncIOMotorDatabase:
    """FastAPI dependency returning the application database."""
    return get_client()[settings.db_name]


async def ping() -> bool:
    """Return True when MongoDB responds to a ping, False otherwise."""
    try:
        await get_client().admin.command("ping")
        return True
    except Exception as exc:  # noqa: BLE001 - report any connectivity failure
        logger.warning("MongoDB ping failed: %s", exc)
        return False


async def close() -> None:
    """Close the client (used on application shutdown)."""
    global _client
    if _client is not None:
        _client.close()
        _client = None
