"""JWT bearer authentication dependencies for protected (admin) routes."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from utils.auth_utils import decode_access_token
from utils.database import get_db
from utils.helpers import parse_object_id, serialize_doc

bearer_scheme = HTTPBearer(auto_error=False)

_CREDENTIALS_ERROR = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid or expired authentication credentials.",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    """Resolve the Bearer token to an active user document (401 on any failure)."""
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise _CREDENTIALS_ERROR

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise _CREDENTIALS_ERROR

    user_oid = parse_object_id(str(payload.get("sub", "")))
    if user_oid is None:
        raise _CREDENTIALS_ERROR

    user = await db.users.find_one({"_id": user_oid})
    if user is None or not user.get("is_active", False):
        raise _CREDENTIALS_ERROR

    user = serialize_doc(user)
    user.pop("password", None)
    return user


_PORTAL_ROLES = {"admin", "staff"}


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    """Dependency used by all /api/admin/* routes.

    Explicit role allowlist — a future non-portal role (e.g. a patient or
    family account) must never inherit portal access by merely existing.
    """
    if user.get("role") not in _PORTAL_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account does not have portal access.",
        )
    return user
