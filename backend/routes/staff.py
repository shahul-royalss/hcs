"""Staff/team routes: public team profiles and admin staff management."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.staff import StaffCreate, StaffUpdate
from utils.database import get_db
from utils.helpers import clean_update, parse_object_id, serialize_doc

router = APIRouter(prefix="/team", tags=["team"])
admin_router = APIRouter(prefix="/staff", tags=["admin:staff"])


# --- Public: team_members collection (website Team page) ---

@router.get("")
async def list_team(db: AsyncIOMotorDatabase = Depends(get_db)) -> list[dict]:
    """All active team members, in display order."""
    cursor = db.team_members.find({"is_active": True}).sort("display_order", 1)
    return serialize_doc(await cursor.to_list(length=200))


@router.get("/{member_id}")
async def get_team_member(member_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """One team member by Mongo id or seed slug (e.g. dr-ananya-rao)."""
    oid = parse_object_id(member_id)
    query = {"_id": oid} if oid else {"slug": member_id}
    member = await db.team_members.find_one({**query, "is_active": True})
    if member is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found.")
    return serialize_doc(member)


# --- Admin: staff collection (assignable workforce) ---

@admin_router.get("")
async def list_staff(
    designation: str | None = Query(default=None),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> list[dict]:
    """All staff records, optionally filtered by designation."""
    query: dict = {}
    if designation:
        query["designation"] = designation
    cursor = db.staff.find(query).sort("name", 1)
    return serialize_doc(await cursor.to_list(length=500))


@admin_router.get("/available")
async def available_staff(db: AsyncIOMotorDatabase = Depends(get_db)) -> list[dict]:
    """Active staff currently available for assignment."""
    cursor = db.staff.find({"is_active": True, "availability_status": "available"}).sort("name", 1)
    return serialize_doc(await cursor.to_list(length=500))


@admin_router.post("", status_code=status.HTTP_201_CREATED)
async def create_staff(payload: StaffCreate, db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """Add a staff member."""
    result = await db.staff.insert_one(payload.model_dump())
    return serialize_doc(await db.staff.find_one({"_id": result.inserted_id}))


@admin_router.put("/{staff_id}")
async def update_staff(
    staff_id: str, payload: StaffUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """Update a staff member."""
    oid = parse_object_id(staff_id)
    if oid is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found.")
    updates = clean_update(payload.model_dump(exclude_unset=True))
    if not updates:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update.")
    result = await db.staff.update_one({"_id": oid}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found.")
    return serialize_doc(await db.staff.find_one({"_id": oid}))


@admin_router.delete("/{staff_id}")
async def delete_staff(staff_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """Remove a staff member (soft delete: is_active → False)."""
    oid = parse_object_id(staff_id)
    if oid is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found.")
    result = await db.staff.update_one({"_id": oid}, {"$set": {"is_active": False}})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found.")
    return {"message": "Staff member deactivated."}
