"""Testimonial routes: public approved reviews and admin moderation."""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.testimonial import TestimonialCreate, TestimonialUpdate
from utils.database import get_db
from utils.helpers import parse_object_id, serialize_doc, utcnow

router = APIRouter(prefix="/testimonials", tags=["testimonials"])
admin_router = APIRouter(prefix="/testimonials", tags=["admin:testimonials"])


# --- Public ---

@router.get("")
async def list_testimonials(db: AsyncIOMotorDatabase = Depends(get_db)) -> list[dict]:
    """Approved testimonials, newest first."""
    cursor = db.testimonials.find({"status": "approved"}).sort("created_at", -1)
    return serialize_doc(await cursor.to_list(length=200))


@router.get("/featured")
async def featured_testimonials(db: AsyncIOMotorDatabase = Depends(get_db)) -> list[dict]:
    """Approved, featured testimonials for the home carousel."""
    cursor = db.testimonials.find({"status": "approved", "is_featured": True}).sort("created_at", -1)
    return serialize_doc(await cursor.to_list(length=50))


@router.post("", status_code=status.HTTP_201_CREATED)
async def submit_testimonial(
    payload: TestimonialCreate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Submit a review; it stays pending until an admin approves it."""
    doc = payload.model_dump()
    doc.update(
        {"is_verified": False, "is_featured": False, "status": "pending", "created_at": utcnow()}
    )
    result = await db.testimonials.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Thank you! Your review is awaiting approval."}


# --- Admin ---

@admin_router.get("")
async def list_all_testimonials(db: AsyncIOMotorDatabase = Depends(get_db)) -> list[dict]:
    """All testimonials regardless of status."""
    cursor = db.testimonials.find({}).sort("created_at", -1)
    return serialize_doc(await cursor.to_list(length=500))


@admin_router.post("", status_code=status.HTTP_201_CREATED)
async def create_testimonial_admin(
    payload: TestimonialCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    approved: bool = True,
) -> dict:
    """Admin-entered review; approved (and verified) immediately by default."""
    doc = payload.model_dump()
    doc.update(
        {
            "is_verified": approved,
            "is_featured": False,
            "status": "approved" if approved else "pending",
            "created_at": utcnow(),
        }
    )
    result = await db.testimonials.insert_one(doc)
    return serialize_doc(await db.testimonials.find_one({"_id": result.inserted_id}))


@admin_router.put("/{testimonial_id}")
async def update_testimonial(
    testimonial_id: str,
    payload: TestimonialUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    """Edit any review fields: content, rating, status, featured/verified flags."""
    oid = parse_object_id(testimonial_id)
    if oid is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found.")
    updates = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if not updates:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update.")
    result = await db.testimonials.update_one({"_id": oid}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found.")
    return serialize_doc(await db.testimonials.find_one({"_id": oid}))


@admin_router.put("/{testimonial_id}/approve")
async def approve_testimonial(
    testimonial_id: str, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Approve a pending review."""
    oid = parse_object_id(testimonial_id)
    if oid is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found.")
    result = await db.testimonials.update_one(
        {"_id": oid}, {"$set": {"status": "approved", "is_verified": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found.")
    return serialize_doc(await db.testimonials.find_one({"_id": oid}))


@admin_router.delete("/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: str, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Delete a review."""
    oid = parse_object_id(testimonial_id)
    if oid is None or (await db.testimonials.delete_one({"_id": oid})).deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found.")
    return {"message": "Testimonial deleted."}
