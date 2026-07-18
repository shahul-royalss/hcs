"""Gallery routes: public browsing and admin management."""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.gallery import GalleryImageCreate, GalleryImageUpdate
from utils import constants
from utils.database import get_db
from utils.helpers import clean_update, parse_object_id, serialize_doc, utcnow

router = APIRouter(prefix="/gallery", tags=["gallery"])
admin_router = APIRouter(prefix="/gallery", tags=["admin:gallery"])


# --- Public ---

@router.get("")
async def list_gallery(db: AsyncIOMotorDatabase = Depends(get_db)) -> list[dict]:
    """All active gallery images, in display order."""
    cursor = db.gallery.find({"is_active": True}).sort("display_order", 1)
    return serialize_doc(await cursor.to_list(length=500))


@router.get("/{category}")
async def gallery_by_category(category: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> list[dict]:
    """Active gallery images in one category (accepts day-care or day_care)."""
    normalized = category.replace("-", "_")
    if normalized not in constants.GALLERY_CATEGORIES:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unknown gallery category.")
    cursor = db.gallery.find({"is_active": True, "category": normalized}).sort("display_order", 1)
    return serialize_doc(await cursor.to_list(length=500))


# --- Admin ---

@admin_router.post("", status_code=status.HTTP_201_CREATED)
async def add_gallery_image(
    payload: GalleryImageCreate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Add a gallery image (image_url based; object storage not configured)."""
    doc = payload.model_dump()
    doc["uploaded_at"] = utcnow()
    result = await db.gallery.insert_one(doc)
    return serialize_doc(await db.gallery.find_one({"_id": result.inserted_id}))


@admin_router.put("/{image_id}")
async def update_gallery_image(
    image_id: str, payload: GalleryImageUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Update a gallery image."""
    oid = parse_object_id(image_id)
    if oid is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found.")
    updates = clean_update(payload.model_dump(exclude_unset=True))
    if not updates:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update.")
    result = await db.gallery.update_one({"_id": oid}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found.")
    return serialize_doc(await db.gallery.find_one({"_id": oid}))


@admin_router.delete("/{image_id}")
async def delete_gallery_image(image_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """Delete a gallery image."""
    oid = parse_object_id(image_id)
    if oid is None or (await db.gallery.delete_one({"_id": oid})).deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found.")
    return {"message": "Gallery image deleted."}
