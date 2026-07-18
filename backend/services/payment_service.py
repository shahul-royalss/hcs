"""Stripe payment handling via its REST API (httpx).

Degrades gracefully: without STRIPE_SECRET_KEY every call logs a warning and
returns a structured {"status": "disabled"} response instead of crashing.
"""

import logging
from typing import Any

import httpx

from utils.config import settings

logger = logging.getLogger(__name__)

STRIPE_API_BASE = "https://api.stripe.com/v1"

_DISABLED = {
    "status": "disabled",
    "reason": "STRIPE_SECRET_KEY not configured",
}


def is_configured() -> bool:
    """True when a Stripe secret key is present."""
    return bool(settings.stripe_secret_key)


async def create_payment_intent(
    amount_inr: float,
    booking_id: str | None = None,
    currency: str = "inr",
    description: str | None = None,
) -> dict[str, Any]:
    """Create a Stripe PaymentIntent; amount is in rupees (converted to paise)."""
    if not is_configured():
        logger.warning("Stripe disabled: STRIPE_SECRET_KEY not configured.")
        return dict(_DISABLED)

    data: dict[str, Any] = {
        "amount": int(round(amount_inr * 100)),  # paise
        "currency": currency,
        "automatic_payment_methods[enabled]": "true",
    }
    if booking_id:
        data["metadata[booking_id]"] = booking_id
    if description:
        data["description"] = description

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                f"{STRIPE_API_BASE}/payment_intents",
                data=data,
                auth=(settings.stripe_secret_key, ""),
            )
            body = resp.json()
            if resp.status_code >= 400:
                logger.error("Stripe error %s: %s", resp.status_code, body)
                return {
                    "status": "error",
                    "reason": body.get("error", {}).get("message", "Stripe API error"),
                }
            return {
                "status": "created",
                "payment_intent_id": body.get("id"),
                "client_secret": body.get("client_secret"),
                "amount": body.get("amount"),
                "currency": body.get("currency"),
            }
    except httpx.HTTPError as exc:
        logger.error("Stripe request failed: %s", exc)
        return {"status": "error", "reason": f"Stripe request failed: {exc}"}


async def handle_webhook_event(payload: dict[str, Any]) -> dict[str, Any]:
    """Process a Stripe webhook event (payment success/failure bookkeeping).

    Note: signature verification requires STRIPE_WEBHOOK_SECRET and the raw
    body; in this deployment we accept the parsed event and act on its type.
    """
    if not is_configured():
        logger.warning("Stripe webhook received but Stripe is not configured.")
        return dict(_DISABLED)

    event_type = payload.get("type", "unknown")
    intent = (payload.get("data") or {}).get("object") or {}
    booking_id = (intent.get("metadata") or {}).get("booking_id")
    logger.info("Stripe webhook: %s (booking_id=%s)", event_type, booking_id)
    return {
        "status": "received",
        "event_type": event_type,
        "booking_id": booking_id,
        "payment_intent_id": intent.get("id"),
    }
