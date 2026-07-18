"""Booking routes: public creation/checks and admin management."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.booking import (
    AssignStaffRequest,
    BookingCreate,
    BookingCreateResponse,
    BookingStatus,
    BookingUpdate,
    ServiceAreaRequest,
)
from services import booking_service, notification_service
from utils import constants
from utils.database import get_db
from utils.helpers import clean_update, parse_object_id, serialize_doc, utcnow

router = APIRouter(prefix="/bookings", tags=["bookings"])
admin_router = APIRouter(prefix="/bookings", tags=["admin:bookings"])


# --- Public ---

@router.post("", response_model=BookingCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    payload: BookingCreate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> BookingCreateResponse:
    """Create a new booking (status: pending) and trigger confirmations."""
    result = await booking_service.create_booking(db, payload)
    return BookingCreateResponse(**result)


@router.get("/check-availability")
async def check_availability(
    date: str | None = Query(default=None, description="Requested date (YYYY-MM-DD)"),
    service_type: str | None = Query(default=None),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    """Check caregiver availability for a date/service."""
    return await booking_service.check_availability(db, date, service_type)


@router.post("/check-service-area")
async def check_service_area(payload: ServiceAreaRequest) -> dict:
    """Verify whether a pincode falls inside the Chittoor service area."""
    served = booking_service.is_pincode_served(payload.pincode)
    return {
        "pincode": payload.pincode,
        "served": served,
        "message": (
            f"Great news — we serve pincode {payload.pincode}."
            if served
            else (
                f"Pincode {payload.pincode} is outside our current service area "
                f"({constants.SERVICE_AREA}). Call {constants.COMPANY_PHONE} to discuss options."
            )
        ),
    }


# --- Admin ---

async def _get_booking_or_404(db: AsyncIOMotorDatabase, booking_id: str) -> dict:
    """Find a booking by Mongo id or human booking_id (BK...)."""
    oid = parse_object_id(booking_id)
    query = {"_id": oid} if oid else {"booking_id": booking_id}
    booking = await db.bookings.find_one(query)
    if booking is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")
    return booking


@admin_router.get("")
async def list_bookings(
    status_filter: BookingStatus | None = Query(default=None, alias="status"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    """All bookings, newest first, with optional status filter and paging."""
    query = {"status": status_filter} if status_filter else {}
    total = await db.bookings.count_documents(query)
    cursor = db.bookings.find(query).sort("created_at", -1).skip(skip).limit(limit)
    return {"total": total, "items": serialize_doc(await cursor.to_list(length=limit))}


@admin_router.get("/{booking_id}")
async def get_booking(booking_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """Booking details by id."""
    return serialize_doc(await _get_booking_or_404(db, booking_id))


@admin_router.put("/{booking_id}")
async def update_booking(
    booking_id: str, payload: BookingUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Partially update a booking."""
    booking = await _get_booking_or_404(db, booking_id)
    updates = clean_update(payload.model_dump(exclude_unset=True))
    if updates:
        updates["updated_at"] = utcnow()
        await db.bookings.update_one({"_id": booking["_id"]}, {"$set": updates})
    return serialize_doc(await db.bookings.find_one({"_id": booking["_id"]}))


@admin_router.delete("/{booking_id}")
async def cancel_booking(booking_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """Cancel a booking (soft delete: status → cancelled)."""
    booking = await _get_booking_or_404(db, booking_id)
    await db.bookings.update_one(
        {"_id": booking["_id"]},
        {"$set": {"status": "cancelled", "updated_at": utcnow()}},
    )
    return {"message": f"Booking {booking.get('booking_id', booking_id)} cancelled."}


@admin_router.post("/{booking_id}/assign-staff")
async def assign_staff(
    booking_id: str, payload: AssignStaffRequest, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Assign a staff member to a booking and mark them assigned."""
    booking = await _get_booking_or_404(db, booking_id)

    staff_oid = parse_object_id(payload.staff_id)
    staff = await db.staff.find_one({"_id": staff_oid}) if staff_oid else None
    if staff is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found.")

    await db.bookings.update_one(
        {"_id": booking["_id"]},
        {
            "$set": {
                "assigned_staff_id": staff["_id"],
                "status": "confirmed",
                "updated_at": utcnow(),
            }
        },
    )
    await db.staff.update_one(
        {"_id": staff["_id"]}, {"$set": {"availability_status": "assigned"}}
    )

    # Best-effort notification to the customer (no-op without provider keys).
    phone = booking.get("contact_info", {}).get("phone")
    if phone:
        notification_service.fire_and_forget_booking_confirmation(
            {**booking, "service_type": booking.get("service_type"), "booking_id": booking.get("booking_id")}
        )

    return {
        "message": f"{staff['name']} assigned to booking {booking.get('booking_id')}.",
        "booking": serialize_doc(await db.bookings.find_one({"_id": booking["_id"]})),
    }
