"""Admin routes for patient care records."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.patient import CareNoteCreate, PatientUpdate
from middleware.auth_middleware import require_admin
from utils.database import get_db
from utils.helpers import clean_update, parse_object_id, serialize_doc, utcnow

admin_router = APIRouter(prefix="/patients", tags=["admin:patients"])


async def _get_patient_or_404(db: AsyncIOMotorDatabase, patient_id: str) -> dict:
    oid = parse_object_id(patient_id)
    patient = await db.patients.find_one({"_id": oid}) if oid else None
    if patient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found.")
    return patient


@admin_router.get("")
async def list_patients(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    """All patient records, newest first."""
    total = await db.patients.count_documents({})
    cursor = db.patients.find({}).sort("created_at", -1).skip(skip).limit(limit)
    return {"total": total, "items": serialize_doc(await cursor.to_list(length=limit))}


@admin_router.get("/{patient_id}")
async def get_patient(patient_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """Patient details by id."""
    return serialize_doc(await _get_patient_or_404(db, patient_id))


@admin_router.put("/{patient_id}")
async def update_patient(
    patient_id: str, payload: PatientUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Update a patient record."""
    patient = await _get_patient_or_404(db, patient_id)
    updates = clean_update(payload.model_dump(exclude_unset=True))
    if updates:
        await db.patients.update_one({"_id": patient["_id"]}, {"$set": updates})
    return serialize_doc(await db.patients.find_one({"_id": patient["_id"]}))


@admin_router.post("/{patient_id}/notes", status_code=status.HTTP_201_CREATED)
async def add_care_note(
    patient_id: str,
    payload: CareNoteCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    user: dict = Depends(require_admin),
) -> dict:
    """Append a timestamped care note authored by the current admin user."""
    patient = await _get_patient_or_404(db, patient_id)
    note = {"note": payload.note, "author": user.get("name"), "timestamp": utcnow()}
    await db.patients.update_one({"_id": patient["_id"]}, {"$push": {"care_notes": note}})
    return serialize_doc(await db.patients.find_one({"_id": patient["_id"]}))
