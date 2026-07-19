"""Shared constants: company profile, service area, pricing, enumerations."""

# --- Company profile (mirrors frontend/src/data/siteConfig.js) ---
COMPANY_NAME = "Dhrishta Health Care Services"
COMPANY_PHONE = "+91 9959388374"
COMPANY_PHONE_DISPLAY = "+91 99593 88374"
COMPANY_WHATSAPP = "+919959388374"
COMPANY_EMAIL = "info@dhrishta.com"
COMPANY_ADDRESS = (
    "Near Reliance Smart Point, Bypass Road, Murakambattu, Chittoor - 517127 (AP)"
)
SERVICE_AREA = "Chittoor, Andhra Pradesh"
SUPPORT_HOURS = "24/7"

# --- Served pincodes (Chittoor region) ---
SERVED_PINCODES: frozenset[str] = frozenset(
    {
        "517001", "517002", "517004", "517101", "517102", "517127",
        "517128", "517129", "517131", "517132", "517167", "517213",
        "517214", "517247", "517257", "517325", "517326", "517415",
        "517416", "517417", "517418", "517419", "517501", "517502",
        "517503", "517505", "517507", "517520", "517561", "517583",
        "517584", "517587", "517588", "517589", "517590", "517599",
    }
)

# --- Package pricing (INR) ---
PACKAGE_PRICES: dict[str, int | None] = {
    "hourly": 249,       # per hour
    "daily": 1199,       # per day
    "weekly": 7499,      # per week
    "monthly": 24999,    # per month
    "custom": None,      # quoted after consultation
}
HOURLY_MIN_HOURS = 4

PACKAGE_TYPES = ("hourly", "daily", "weekly", "monthly", "custom")

# --- Booking ---
BOOKING_STATUSES = ("pending", "confirmed", "in_progress", "completed", "cancelled")
BOOKING_ID_PREFIX = "BK"

# --- Staff ---
STAFF_DESIGNATIONS = ("doctor", "nurse", "caregiver", "physiotherapist", "support_staff")
STAFF_AVAILABILITY = ("available", "assigned", "on_leave")

# --- Users ---
USER_ROLES = ("admin", "staff", "manager")

# --- Misc enumerations ---
TESTIMONIAL_STATUSES = ("pending", "approved", "rejected")
CONTACT_STATUSES = ("new", "contacted", "converted", "closed")
GALLERY_CATEGORIES = (
    "facilities", "daily_activities", "care_programs", "events", "team", "day_care",
)
SERVICE_CATEGORIES = (
    "personal_care", "nursing", "elder_care", "patient_care", "child_care", "day_care",
)

# --- Chat ---
CHAT_HISTORY_LIMIT = 20  # messages of context sent to the AI model
