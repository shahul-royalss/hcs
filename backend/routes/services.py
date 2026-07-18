"""Public routes for care services."""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.service import ServiceCategory
from utils.database import get_db
from utils.helpers import serialize_doc

router = APIRouter(prefix="/services", tags=["services"])


@router.get("")
async def list_services(db: AsyncIOMotorDatabase = Depends(get_db)) -> list[dict]:
    """All active services, in display order."""
    cursor = db.services.find({"is_active": True}).sort("display_order", 1)
    return serialize_doc(await cursor.to_list(length=100))


@router.get("/category/{category}")
async def services_by_category(
    category: ServiceCategory, db: AsyncIOMotorDatabase = Depends(get_db)
) -> list[dict]:
    """Active services within one category."""
    cursor = db.services.find({"is_active": True, "category": category}).sort("display_order", 1)
    return serialize_doc(await cursor.to_list(length=100))


@router.get("/{slug}")
async def get_service(slug: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """Details of one service by slug."""
    service = await db.services.find_one({"slug": slug, "is_active": True})
    if service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found.")
    return serialize_doc(service)
