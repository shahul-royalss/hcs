"""WhatsApp routes: outbound messages and inbound webhook (Twilio)."""

import logging

from fastapi import APIRouter, Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field, field_validator

from services import notification_service
from utils.database import get_db
from utils.helpers import utcnow
from utils.validators import validate_phone

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])


class WhatsAppSendRequest(BaseModel):
    to: str
    message: str = Field(min_length=1, max_length=1600)

    @field_validator("to")
    @classmethod
    def _phone(cls, v: str) -> str:
        return validate_phone(v)


@router.post("/send")
async def send_whatsapp(payload: WhatsAppSendRequest) -> dict:
    """Send a WhatsApp message via Twilio (disabled response without keys)."""
    return await notification_service.send_whatsapp(payload.to, payload.message)


@router.post("/webhook")
async def whatsapp_webhook(request: Request, db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """Receive inbound WhatsApp messages (Twilio posts form-encoded data)."""
    try:
        form = await request.form()
        data = {key: form[key] for key in form}
    except Exception:  # noqa: BLE001 - tolerate JSON test payloads too
        try:
            data = await request.json()
        except Exception:  # noqa: BLE001
            data = {}

    message = {
        "from": data.get("From"),
        "to": data.get("To"),
        "body": data.get("Body"),
        "message_sid": data.get("MessageSid"),
        "received_at": utcnow(),
    }
    logger.info("Inbound WhatsApp message from %s", message["from"])
    await db.whatsapp_inbound.insert_one(message)
    return {"status": "received"}
