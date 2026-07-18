"""Outbound notifications: Twilio SMS/WhatsApp and Resend email via httpx.

Every channel degrades gracefully — when its credentials are missing the
function logs a warning and returns {"status": "disabled", "reason": ...}.
"""

import asyncio
import logging
from typing import Any

import httpx

from utils import constants
from utils.config import settings

logger = logging.getLogger(__name__)

TWILIO_API_BASE = "https://api.twilio.com/2010-04-01"
RESEND_API_URL = "https://api.resend.com/emails"
EMAIL_FROM = f"{constants.COMPANY_NAME} <no-reply@dhrishta.com>"


def _disabled(reason: str) -> dict[str, str]:
    logger.warning("Notification skipped: %s", reason)
    return {"status": "disabled", "reason": reason}


async def _twilio_send(to: str, body: str, from_: str, channel: str) -> dict[str, Any]:
    """POST a message to the Twilio REST API."""
    url = f"{TWILIO_API_BASE}/Accounts/{settings.twilio_account_sid}/Messages.json"
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                url,
                data={"From": from_, "To": to, "Body": body},
                auth=(settings.twilio_account_sid, settings.twilio_auth_token),
            )
            data = resp.json()
            if resp.status_code >= 400:
                logger.error("Twilio %s error %s: %s", channel, resp.status_code, data)
                return {"status": "error", "reason": data.get("message", "Twilio API error")}
            return {"status": "sent", "sid": data.get("sid"), "channel": channel}
    except httpx.HTTPError as exc:
        logger.error("Twilio %s request failed: %s", channel, exc)
        return {"status": "error", "reason": str(exc)}


async def send_sms(to: str, body: str) -> dict[str, Any]:
    """Send an SMS via Twilio."""
    if not (settings.twilio_account_sid and settings.twilio_auth_token and settings.twilio_sms_number):
        return _disabled("TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_SMS_NUMBER not configured")
    return await _twilio_send(to, body, settings.twilio_sms_number, "sms")


async def send_whatsapp(to: str, body: str) -> dict[str, Any]:
    """Send a WhatsApp message via Twilio."""
    if not (settings.twilio_account_sid and settings.twilio_auth_token and settings.twilio_whatsapp_number):
        return _disabled("TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_WHATSAPP_NUMBER not configured")
    return await _twilio_send(
        f"whatsapp:{to}", body, f"whatsapp:{settings.twilio_whatsapp_number}", "whatsapp"
    )


async def send_email(to: str, subject: str, html: str) -> dict[str, Any]:
    """Send an email via the Resend API."""
    if not settings.resend_api_key:
        return _disabled("RESEND_API_KEY not configured")
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                RESEND_API_URL,
                json={"from": EMAIL_FROM, "to": [to], "subject": subject, "html": html},
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
            )
            data = resp.json()
            if resp.status_code >= 400:
                logger.error("Resend error %s: %s", resp.status_code, data)
                return {"status": "error", "reason": data.get("message", "Resend API error")}
            return {"status": "sent", "id": data.get("id"), "channel": "email"}
    except httpx.HTTPError as exc:
        logger.error("Resend request failed: %s", exc)
        return {"status": "error", "reason": str(exc)}


async def send_booking_confirmation(booking: dict[str, Any]) -> None:
    """Send booking confirmations on every available channel (best-effort)."""
    contact = booking.get("contact_info", {})
    phone = contact.get("phone")
    email = contact.get("email")
    booking_id = booking.get("booking_id", "")

    text = (
        f"Dhrishta Healthcare: booking {booking_id} received for "
        f"{booking.get('service_type', 'home care')}. Our team will call you shortly "
        f"to confirm. Questions? {constants.COMPANY_PHONE}"
    )
    html = (
        f"<h2>Thank you for booking with {constants.COMPANY_NAME}</h2>"
        f"<p>Your booking <strong>{booking_id}</strong> for "
        f"<strong>{booking.get('service_type', 'home care')}</strong> has been received "
        f"and is <strong>pending confirmation</strong>. Our care coordinator will call "
        f"you shortly.</p>"
        f"<p>Need help? Call {constants.COMPANY_PHONE} (24/7) or reply to this email.</p>"
        f"<p>{constants.COMPANY_ADDRESS}</p>"
    )

    tasks = []
    if phone:
        tasks.append(send_sms(phone, text))
        tasks.append(send_whatsapp(phone, text))
    if email:
        tasks.append(send_email(email, f"Booking {booking_id} received - Dhrishta Healthcare", html))

    results = await asyncio.gather(*tasks, return_exceptions=True)
    for result in results:
        if isinstance(result, Exception):
            logger.error("Booking notification failed: %s", result)


def fire_and_forget_booking_confirmation(booking: dict[str, Any]) -> None:
    """Schedule confirmation notifications without blocking the request."""
    try:
        asyncio.get_running_loop().create_task(send_booking_confirmation(booking))
    except RuntimeError:  # no running loop (e.g. sync test context)
        logger.warning("No running event loop; skipping booking notifications.")
