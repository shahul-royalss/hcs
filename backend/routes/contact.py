"""Contact routes: inquiries, callback requests, emergencies; admin management."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.contact import (
    CallbackRequest,
    ContactCreate,
    ContactStatus,
    ContactUpdate,
    EmergencyRequest,
)
from utils import constants
from utils.database import get_db
from utils.helpers import clean_update, parse_object_id, serialize_doc, utcnow

router = APIRouter(tags=["contact"])
admin_router = APIRouter(prefix="/contacts", tags=["admin:contacts"])


async def _save_inquiry(db: AsyncIOMotorDatabase, doc: dict, kind: str) -> str:
    doc.update({"kind": kind, "status": "new", "notes": None, "created_at": utcnow()})
    result = await db.contacts.insert_one(doc)
    return str(result.inserted_id)


# --- Public ---

@router.post("/contact", status_code=status.HTTP_201_CREATED)
async def submit_contact(
    payload: ContactCreate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Submit the contact form."""
    inquiry_id = await _save_inquiry(db, payload.model_dump(), "inquiry")
    return {
        "id": inquiry_id,
        "message": "Thank you for reaching out. Our team will get back to you shortly.",
    }


@router.post("/contact/callback", status_code=status.HTTP_201_CREATED)
async def request_callback(
    payload: CallbackRequest, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Request a callback from the care team."""
    doc = payload.model_dump()
    doc["message"] = f"Callback requested ({payload.preferred_contact_time or 'any time'})."
    inquiry_id = await _save_inquiry(db, doc, "callback")
    return {"id": inquiry_id, "message": "Callback requested. We will call you soon."}


@router.post("/emergency", status_code=status.HTTP_201_CREATED)
async def emergency_request(
    payload: EmergencyRequest, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Log an emergency request and direct the caller to the 24/7 line."""
    doc = payload.model_dump()
    doc["message"] = doc.get("message") or "EMERGENCY assistance requested."
    inquiry_id = await _save_inquiry(db, doc, "emergency")
    return {
        "id": inquiry_id,
        "message": (
            f"Emergency request logged. For immediate help call {constants.COMPANY_PHONE} "
            "now — our team responds 24/7."
        ),
        "phone": constants.COMPANY_PHONE,
    }


# --- Admin ---

@admin_router.get("")
async def list_contacts(
    status_filter: ContactStatus | None = Query(default=None, alias="status"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    """All inquiries, newest first."""
    query = {"status": status_filter} if status_filter else {}
    total = await db.contacts.count_documents(query)
    cursor = db.contacts.find(query).sort("created_at", -1).skip(skip).limit(limit)
    return {"total": total, "items": serialize_doc(await cursor.to_list(length=limit))}


@admin_router.put("/{contact_id}")
async def update_contact(
    contact_id: str, payload: ContactUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Update inquiry status/notes."""
    oid = parse_object_id(contact_id)
    if oid is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found.")
    updates = clean_update(payload.model_dump(exclude_unset=True))
    if not updates:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update.")
    result = await db.contacts.update_one({"_id": oid}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found.")
    return serialize_doc(await db.contacts.find_one({"_id": oid}))
