"""Object storage abstraction.

No external object store (e.g. S3/GCS) is configured in this deployment, so
gallery/staff images are stored as URLs pointing at frontend-served assets or
external hosts. This module keeps a stable interface for a future backend.
"""

import logging
from typing import Any

logger = logging.getLogger(__name__)


def is_configured() -> bool:
    """True when an external object storage backend is configured (none yet)."""
    return False


async def upload_file(filename: str, content: bytes, content_type: str = "application/octet-stream") -> dict[str, Any]:
    """Upload a file to object storage; disabled until a backend is configured."""
    logger.warning("Object storage disabled; rejected upload of %s (%d bytes).", filename, len(content))
    return {
        "status": "disabled",
        "reason": "Object storage backend not configured; provide an image_url instead.",
    }


def resolve_url(url: str | None) -> str | None:
    """Pass through stored URLs (hook point for signed URLs later)."""
    return url
