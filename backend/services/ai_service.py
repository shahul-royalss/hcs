"""AI chatbot logic: Anthropic Messages API with a rule-based fallback.

Without AI_MODEL_API_KEY configured the bot still answers using a small
intent matcher covering Dhrishta's services, packages, booking and
emergency escalation. Conversations persist in `chat_conversations`.
"""

import logging
import uuid

import httpx
from motor.motor_asyncio import AsyncIOMotorDatabase

from utils import constants
from utils.config import settings
from utils.helpers import utcnow

logger = logging.getLogger(__name__)

ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"

SYSTEM_PROMPT = f"""You are the friendly virtual assistant of {constants.COMPANY_NAME},
a trusted home healthcare provider in Chittoor, Andhra Pradesh, India.

About Dhrishta:
- Services: Personal Care, Home Nursing, Elder Care, Patient Care, Child Care, Day Care.
- Packages: Hourly Care ₹249/hr (minimum 4 hours), Daily Care ₹1199/day,
  Weekly Care ₹7499/week, Monthly Care ₹24999/month, and Custom plans (free assessment).
- Phone: {constants.COMPANY_PHONE} | Email: {constants.COMPANY_EMAIL}
- Address: {constants.COMPANY_ADDRESS}
- Service area: Chittoor and surrounding areas (Andhra Pradesh). Support hours: 24/7.

Guidelines:
- Be warm, concise and helpful; answer in the user's language (English or Hindi).
- Help users pick a service/package and guide them to book via the website's
  "Book Consultation" page or by calling {constants.COMPANY_PHONE}.
- For medical emergencies, tell the user to immediately call {constants.COMPANY_PHONE}
  or local emergency services (108). Do not give medical diagnoses.
"""

_FALLBACK_SERVICES = (
    "We offer six core services, all delivered at your home in Chittoor:\n"
    "1. Personal Care (bathing, grooming, mobility, meals)\n"
    "2. Home Nursing (wound care, injections, IV therapy, vitals)\n"
    "3. Elder Care (companionship, dementia/Alzheimer's, stroke recovery)\n"
    "4. Patient Care (bedridden, chronic illness, palliative, rehab)\n"
    "5. Child Care (infants, special needs, post-surgery)\n"
    "6. Day Care (supervised day programs with meals and activities)\n"
    f"Would you like pricing details or help booking? Call us anytime at {constants.COMPANY_PHONE}."
)

_FALLBACK_PRICING = (
    "Our care packages:\n"
    "- Hourly Care: ₹249/hour (minimum 4 hours)\n"
    "- Daily Care: ₹1199/day (8-12 hours coverage)\n"
    "- Weekly Care: ₹7499/week (supervisor visit included)\n"
    "- Monthly Care: ₹24999/month (dedicated care team, best value)\n"
    "- Custom Plans: free in-person assessment and a personalised quote\n"
    f"To choose the right plan, call {constants.COMPANY_PHONE} — we're available 24/7."
)

_FALLBACK_BOOKING = (
    "Booking is easy! Use the 'Book Consultation' page on our website — tell us the "
    "service, preferred date and your address, and we confirm within hours. "
    f"Prefer to talk? Call or WhatsApp us at {constants.COMPANY_PHONE} (24/7)."
)

_FALLBACK_EMERGENCY = (
    f"For emergencies please CALL US IMMEDIATELY at {constants.COMPANY_PHONE} — "
    "our team responds 24/7. If this is a life-threatening medical emergency, "
    "also call the 108 ambulance service right away."
)

_FALLBACK_AREA = (
    "We serve Chittoor city and surrounding areas of Chittoor district, Andhra Pradesh. "
    "Share your 6-digit pincode on the booking page to confirm coverage, or call "
    f"{constants.COMPANY_PHONE} and we'll check for you."
)

_FALLBACK_CONTACT = (
    f"You can reach us 24/7:\n- Phone/WhatsApp: {constants.COMPANY_PHONE}\n"
    f"- Email: {constants.COMPANY_EMAIL}\n- Address: {constants.COMPANY_ADDRESS}"
)

_FALLBACK_GREETING = (
    f"Hello! Welcome to {constants.COMPANY_NAME}. I can tell you about our home "
    "healthcare services, pricing packages, or help you book a consultation in "
    "Chittoor. How can I help you today?"
)

_FALLBACK_DEFAULT = (
    "I'm here to help with Dhrishta's home healthcare services in Chittoor — "
    "services, packages, pricing and bookings. For anything specific, call or "
    f"WhatsApp us 24/7 at {constants.COMPANY_PHONE}, or email {constants.COMPANY_EMAIL}."
)

_INTENTS: list[tuple[tuple[str, ...], str]] = [
    (("emergency", "urgent", "immediately", "accident", "critical", "ambulance"), _FALLBACK_EMERGENCY),
    (("price", "pricing", "cost", "charge", "fee", "rate", "package", "plan", "₹", "rupee"), _FALLBACK_PRICING),
    (("book", "booking", "appointment", "schedule", "consultation", "consult"), _FALLBACK_BOOKING),
    (("area", "location", "pincode", "coverage", "where", "chittoor", "serve"), _FALLBACK_AREA),
    (("contact", "phone", "call", "email", "address", "reach", "whatsapp"), _FALLBACK_CONTACT),
    (("service", "nursing", "nurse", "elder", "child", "patient", "personal care", "day care", "caregiver", "offer"), _FALLBACK_SERVICES),
    (("hi", "hello", "hey", "namaste", "namaskaram", "good morning", "good evening", "good afternoon"), _FALLBACK_GREETING),
]


def rule_based_reply(message: str) -> str:
    """Keyword intent matcher used when no AI key is configured (or API fails)."""
    text = message.lower()
    words = set(text.replace("?", " ").replace(",", " ").replace(".", " ").split())
    for keywords, reply in _INTENTS:
        for kw in keywords:
            if " " in kw:
                if kw in text:
                    return reply
            # Prefix match (>=4 chars) covers plurals/inflections: prices, packages, booking…
            elif kw in words or (len(kw) >= 4 and any(w.startswith(kw) for w in words)):
                return reply
    return _FALLBACK_DEFAULT


async def _call_anthropic(history: list[dict]) -> str | None:
    """Call the Anthropic Messages API; return the reply text or None on failure."""
    payload = {
        "model": settings.ai_model,
        "max_tokens": 512,
        "system": SYSTEM_PROMPT,
        "messages": [{"role": m["role"], "content": m["content"]} for m in history],
    }
    headers = {
        "x-api-key": settings.ai_model_api_key,
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
    }
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(ANTHROPIC_API_URL, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            blocks = data.get("content", [])
            text = "".join(b.get("text", "") for b in blocks if b.get("type") == "text")
            return text.strip() or None
    except Exception as exc:  # noqa: BLE001 - degrade gracefully on any API failure
        logger.warning("Anthropic API call failed, using rule-based fallback: %s", exc)
        return None


async def get_chat_reply(
    db: AsyncIOMotorDatabase,
    message: str,
    session_id: str | None = None,
    user_phone: str | None = None,
) -> dict:
    """Answer a chat message, persisting the conversation by session_id."""
    session_id = session_id or uuid.uuid4().hex
    now = utcnow()

    # The assistant must keep answering even if MongoDB is unreachable —
    # history/persistence are best-effort.
    try:
        conversation = await db.chat_conversations.find_one({"session_id": session_id})
    except Exception as exc:  # noqa: BLE001
        logger.warning("Chat history unavailable (DB down?): %s", exc)
        conversation = None
    history = list((conversation or {}).get("messages", []))[-(constants.CHAT_HISTORY_LIMIT - 1):]
    history.append({"role": "user", "content": message, "timestamp": now})

    source = "fallback"
    reply: str | None = None
    if settings.ai_model_api_key:
        reply = await _call_anthropic(
            [{"role": m["role"], "content": m["content"]} for m in history]
        )
        if reply is not None:
            source = "ai"
    else:
        logger.warning("AI_MODEL_API_KEY not configured; using rule-based chatbot fallback.")
    if reply is None:
        reply = rule_based_reply(message)

    try:
        await db.chat_conversations.update_one(
            {"session_id": session_id},
            {
                "$push": {
                    "messages": {
                        "$each": [
                            {"role": "user", "content": message, "timestamp": now},
                            {"role": "assistant", "content": reply, "timestamp": utcnow()},
                        ]
                    }
                },
                "$set": {"status": "active", "updated_at": utcnow(), "user_phone": user_phone},
                "$setOnInsert": {"created_at": now},
            },
            upsert=True,
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("Could not persist chat message (DB down?): %s", exc)

    return {"session_id": session_id, "reply": reply, "source": source}
