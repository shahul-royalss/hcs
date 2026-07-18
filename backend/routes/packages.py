"""Public routes for care packages."""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from utils.database import get_db
from utils.helpers import parse_object_id, serialize_doc

router = APIRouter(prefix="/packages", tags=["packages"])


@router.get("")
async def list_packages(db: AsyncIOMotorDatabase = Depends(get_db)) -> list[dict]:
    """All packages, in display order."""
    cursor = db.packages.find({}).sort("display_order", 1)
    return serialize_doc(await cursor.to_list(length=50))


@router.get("/{package_id}")
async def get_package(package_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """One package by Mongo id or by type (e.g. 'weekly')."""
    oid = parse_object_id(package_id)
    query = {"_id": oid} if oid else {"type": package_id}
    package = await db.packages.find_one(query)
    if package is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found.")
    return serialize_doc(package)
