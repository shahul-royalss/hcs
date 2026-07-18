"""Authentication routes: login, logout, current user."""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from middleware.auth_middleware import get_current_user
from models.user import LoginRequest, TokenResponse, UserResponse
from utils.auth_utils import create_access_token, verify_password
from utils.config import settings
from utils.database import get_db
from utils.helpers import serialize_doc, utcnow

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_db)) -> TokenResponse:
    """Verify email/password and issue a JWT access token."""
    user = await db.users.find_one({"email": payload.email.lower()})
    if user is None or not verify_password(payload.password, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    if not user.get("is_active", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    await db.users.update_one({"_id": user["_id"]}, {"$set": {"last_login": utcnow()}})

    token = create_access_token(str(user["_id"]), user.get("role", "staff"))
    safe = serialize_doc(user)
    safe.pop("password", None)
    return TokenResponse(
        access_token=token,
        expires_in=settings.jwt_expires_minutes * 60,
        user=UserResponse(**safe),
    )


@router.post("/logout")
async def logout() -> dict:
    """Stateless logout — clients simply discard the token."""
    return {"message": "Logged out. Please discard your access token."}


@router.get("/me", response_model=UserResponse)
async def me(user: dict = Depends(get_current_user)) -> UserResponse:
    """Return the authenticated user's profile."""
    return UserResponse(**user)
