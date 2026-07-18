"""Email notification route (Resend)."""

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr, Field

from services import notification_service

router = APIRouter(prefix="/notifications", tags=["notifications"])


class EmailSendRequest(BaseModel):
    to: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    html: str = Field(min_length=1, max_length=100_000)


@router.post("/email")
async def send_email(payload: EmailSendRequest) -> dict:
    """Send an email via Resend (disabled response without a key)."""
    return await notification_service.send_email(payload.to, payload.subject, payload.html)
