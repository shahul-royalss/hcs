"""Admin API: analytics endpoints and aggregation of all admin sub-routers.

Everything mounted here lives under /api/admin and requires a valid JWT
(`require_admin` dependency applied router-wide).
"""

from datetime import timedelta

from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from middleware.auth_middleware import require_admin
from routes import bookings, contact, gallery, patients, staff, testimonials
from utils.database import get_db
from utils.helpers import utcnow

router = APIRouter(prefix="/admin", dependencies=[Depends(require_admin)])

# Domain admin routers (bookings CRUD, staff, patients, gallery, testimonials, contacts)
router.include_router(bookings.admin_router)
router.include_router(staff.admin_router)
router.include_router(patients.admin_router)
router.include_router(gallery.admin_router)
router.include_router(testimonials.admin_router)
router.include_router(contact.admin_router)

analytics = APIRouter(prefix="/analytics", tags=["admin:analytics"])


@analytics.get("/dashboard")
async def dashboard_stats(db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """Headline numbers for the admin dashboard."""
    now = utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total_bookings = await db.bookings.count_documents({})
    pending = await db.bookings.count_documents({"status": "pending"})
    confirmed = await db.bookings.count_documents({"status": "confirmed"})
    in_progress = await db.bookings.count_documents({"status": "in_progress"})
    completed = await db.bookings.count_documents({"status": "completed"})
    bookings_this_month = await db.bookings.count_documents({"created_at": {"$gte": month_start}})

    revenue_pipeline = [
        {"$match": {"status": {"$ne": "cancelled"}, "payment.amount": {"$ne": None}}},
        {
            "$group": {
                "_id": None,
                "booked_value": {"$sum": "$payment.amount"},
                "collected": {"$sum": "$payment.advance_paid"},
            }
        },
    ]
    revenue = await db.bookings.aggregate(revenue_pipeline).to_list(length=1)
    revenue_row = revenue[0] if revenue else {"booked_value": 0, "collected": 0}

    return {
        "bookings": {
            "total": total_bookings,
            "pending": pending,
            "confirmed": confirmed,
            "in_progress": in_progress,
            "completed": completed,
            "this_month": bookings_this_month,
        },
        "revenue": {
            "booked_value": revenue_row.get("booked_value", 0),
            "collected": revenue_row.get("collected", 0),
        },
        "staff": {
            "total": await db.staff.count_documents({"is_active": True}),
            "available": await db.staff.count_documents(
                {"is_active": True, "availability_status": "available"}
            ),
        },
        "patients": await db.patients.count_documents({}),
        "contacts_new": await db.contacts.count_documents({"status": "new"}),
        "testimonials_pending": await db.testimonials.count_documents({"status": "pending"}),
    }


@analytics.get("/bookings")
async def booking_trends(
    days: int = Query(default=30, ge=1, le=365),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    """Daily booking counts (by status) over the trailing window."""
    since = utcnow() - timedelta(days=days)
    pipeline = [
        {"$match": {"created_at": {"$gte": since}}},
        {
            "$group": {
                "_id": {
                    "day": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                    "status": "$status",
                },
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id.day": 1}},
    ]
    rows = await db.bookings.aggregate(pipeline).to_list(length=2000)

    trend: dict[str, dict] = {}
    for row in rows:
        day = row["_id"]["day"]
        entry = trend.setdefault(day, {"date": day, "total": 0})
        entry[row["_id"]["status"]] = row["count"]
        entry["total"] += row["count"]
    return {"days": days, "trend": sorted(trend.values(), key=lambda e: e["date"])}


@analytics.get("/revenue")
async def revenue_report(
    months: int = Query(default=6, ge=1, le=24),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    """Monthly booked value and collected amounts."""
    since = utcnow() - timedelta(days=months * 31)
    pipeline = [
        {"$match": {"created_at": {"$gte": since}, "status": {"$ne": "cancelled"}}},
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m", "date": "$created_at"}},
                "bookings": {"$sum": 1},
                "booked_value": {"$sum": {"$ifNull": ["$payment.amount", 0]}},
                "collected": {"$sum": {"$ifNull": ["$payment.advance_paid", 0]}},
            }
        },
        {"$sort": {"_id": 1}},
    ]
    rows = await db.bookings.aggregate(pipeline).to_list(length=48)
    return {
        "months": months,
        "report": [
            {
                "month": row["_id"],
                "bookings": row["bookings"],
                "booked_value": row["booked_value"],
                "collected": row["collected"],
            }
            for row in rows
        ],
    }


@analytics.get("/services")
async def popular_services(db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    """Booking counts per service type, most popular first."""
    pipeline = [
        {"$match": {"status": {"$ne": "cancelled"}}},
        {
            "$group": {
                "_id": "$service_type",
                "bookings": {"$sum": 1},
                "booked_value": {"$sum": {"$ifNull": ["$payment.amount", 0]}},
            }
        },
        {"$sort": {"bookings": -1}},
    ]
    rows = await db.bookings.aggregate(pipeline).to_list(length=100)
    return {
        "services": [
            {"service_type": row["_id"], "bookings": row["bookings"], "booked_value": row["booked_value"]}
            for row in rows
        ]
    }


router.include_router(analytics)
