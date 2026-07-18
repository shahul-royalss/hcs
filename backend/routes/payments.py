"""Payment routes: Stripe payment intents and webhooks."""

from fastapi import APIRouter, Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field

from services import payment_service
from utils.database import get_db
from utils.helpers import utcnow

router = APIRouter(prefix="/payments", tags=["payments"])


class PaymentIntentRequest(BaseModel):
    amount: float = Field(gt=0, description="Amount in INR (rupees)")
    booking_id: str | None = None
    description: str | None = None


@router.post("/create-intent")
async def create_intent(payload: PaymentIntentRequest) -> dict:
    """Create a Stripe payment intent (disabled response without a key)."""
    return await payment_service.create_payment_intent(
        payload.amount, payload.booking_id, description=payload.description
    )


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """Receive Stripe webhook events and update booking payment status."""
    try:
        event = await request.json()
    except Exception:  # noqa: BLE001 - malformed webhook body
        return {"status": "ignored", "reason": "Invalid JSON payload."}

    result = await payment_service.handle_webhook_event(event)

    if (
        result.get("status") == "received"
        and result.get("event_type") == "payment_intent.succeeded"
        and result.get("booking_id")
    ):
        intent = (event.get("data") or {}).get("object") or {}
        amount_inr = (intent.get("amount_received") or 0) / 100
        await db.bookings.update_one(
            {"booking_id": result["booking_id"]},
            {
                "$set": {
                    "payment.payment_status": "paid",
                    "payment.advance_paid": amount_inr,
                    "payment.payment_method": "stripe",
                    "payment.transaction_id": result.get("payment_intent_id"),
                    "updated_at": utcnow(),
                }
            },
        )
    return result
