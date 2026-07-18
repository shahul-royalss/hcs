"""Booking business logic: id generation, service-area check, cost estimation."""

import logging
from datetime import datetime, time, timezone
from typing import Any

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.booking import BookingCreate
from services import notification_service
from utils import constants
from utils.helpers import utcnow

logger = logging.getLogger(__name__)


def is_pincode_served(pincode: str) -> bool:
    """True when the pincode is inside Dhrishta's Chittoor-region service area."""
    return pincode in constants.SERVED_PINCODES


def estimate_cost(package_type: str) -> float | None:
    """Estimated booking cost from the package type (custom plans are quoted)."""
    price = constants.PACKAGE_PRICES.get(package_type)
    if price is None:
        return None
    if package_type == "hourly":
        return float(price * constants.HOURLY_MIN_HOURS)  # assume minimum 4 hours
    return float(price)


async def generate_booking_id(db: AsyncIOMotorDatabase) -> str:
    """Generate an id like BK20250115001 (date + 3-digit daily sequence)."""
    today = utcnow().strftime("%Y%m%d")
    prefix = f"{constants.BOOKING_ID_PREFIX}{today}"
    count = await db.bookings.count_documents({"booking_id": {"$regex": f"^{prefix}"}})
    return f"{prefix}{count + 1:03d}"


async def create_booking(db: AsyncIOMotorDatabase, payload: BookingCreate) -> dict[str, Any]:
    """Validate, persist and confirm a new booking.

    Returns {booking_id, status, message, estimated_cost}. Confirmation
    notifications (email/SMS/WhatsApp) are fired without blocking; each is a
    no-op when its provider credentials are missing.
    """
    pincode = payload.contact_info.pincode
    if not is_pincode_served(pincode):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Sorry, pincode {pincode} is outside our current service area "
                f"({constants.SERVICE_AREA}). Please call {constants.COMPANY_PHONE} "
                "to discuss options."
            ),
        )

    booking_id = await generate_booking_id(db)
    estimated_cost = estimate_cost(payload.package_type)
    now = utcnow()

    doc = payload.model_dump()
    # BSON has no `date` type — store the start date as a UTC datetime.
    start_date = doc["schedule"]["start_date"]
    doc["schedule"]["start_date"] = datetime.combine(start_date, time.min, tzinfo=timezone.utc)

    doc.update(
        {
            "booking_id": booking_id,
            "assigned_staff_id": None,
            "status": "pending",
            "payment": {
                "amount": estimated_cost,
                "advance_paid": 0,
                "payment_status": "pending",
                "payment_method": None,
                "transaction_id": None,
            },
            "created_at": now,
            "updated_at": now,
        }
    )
    await db.bookings.insert_one(doc)
    logger.info("Booking %s created (%s / %s)", booking_id, payload.service_type, payload.package_type)

    notification_service.fire_and_forget_booking_confirmation(doc)

    return {
        "booking_id": booking_id,
        "status": "pending",
        "message": (
            "Booking received. Our care coordinator will contact you shortly to confirm."
        ),
        "estimated_cost": estimated_cost,
    }


async def check_availability(
    db: AsyncIOMotorDatabase,
    service_date: str | None = None,
    service_type: str | None = None,
) -> dict[str, Any]:
    """Report staff availability (best-effort based on the staff roster)."""
    total_staff = await db.staff.count_documents({"is_active": True})
    available_staff = await db.staff.count_documents(
        {"is_active": True, "availability_status": "available"}
    )
    available = available_staff > 0 if total_staff > 0 else True
    return {
        "date": service_date,
        "service_type": service_type,
        "available": available,
        "available_staff": available_staff,
        "message": (
            "Caregivers are available for your requested date."
            if available
            else f"All caregivers are currently assigned — call {constants.COMPANY_PHONE} for priority scheduling."
        ),
    }
