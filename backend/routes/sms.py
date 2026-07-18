"""SMS notification route (Twilio)."""

from fastapi import APIRouter
from pydantic import BaseModel, Field, field_validator

from services import notification_service
from utils.validators import validate_phone

router = APIRouter(prefix="/notifications", tags=["notifications"])


class SmsSendRequest(BaseModel):
    to: str
    message: str = Field(min_length=1, max_length=1600)

    @field_validator("to")
    @classmethod
    def _phone(cls, v: str) -> str:
        return validate_phone(v)


@router.post("/sms")
async def send_sms(payload: SmsSendRequest) -> dict:
    """Send an SMS via Twilio (disabled response without keys)."""
    return await notification_service.send_sms(payload.to, payload.message)
