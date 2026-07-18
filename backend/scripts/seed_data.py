"""Seed the Dhrishta Healthcare database with website content and an admin user.

Mirrors frontend/src/data/{services,packages,team,testimonials,gallery}.js.
Idempotent: every document is upserted by a stable key (slug/type/seed_key),
so re-running never duplicates data. The admin password is only set on first
insert (a changed password survives re-seeding).

Usage (from the backend/ directory):  python scripts/seed_data.py
"""

import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils import constants  # noqa: E402
from utils.auth_utils import hash_password  # noqa: E402
from utils.config import settings  # noqa: E402
from utils.database import get_db, ping  # noqa: E402
from utils.helpers import utcnow  # noqa: E402

ADMIN_EMAIL = "admin@dhrishta.com"

SERVICES = [
    {
        "slug": "personal-care",
        "name": "Personal Care Services",
        "short_name": "Personal Care",
        "category": "personal_care",
        "icon": "HandHeart",
        "image_url": "/images/services/personal-care.svg",
        "excerpt": "Dignified day-to-day assistance with bathing, grooming, mobility and meals — delivered with warmth at home.",
        "description": "Our personal care attendants help your loved ones stay independent and comfortable in their own home. From morning routines to medication reminders, we take care of the everyday essentials with patience, privacy and respect.",
        "features": ["Bathing assistance", "Grooming", "Mobility support", "Meal assistance", "Medication reminders"],
        "included": [
            "Trained and verified care attendant",
            "Personalised daily-care routine",
            "Hygiene and grooming support",
            "Assistance with walking and transfers",
            "Daily activity and wellness updates to family",
        ],
        "pricing_starts_from": 349,
        "pricing_unit": "per visit",
        "related": ["elder-care", "patient-care", "home-nursing"],
    },
    {
        "slug": "home-nursing",
        "name": "Home Nursing Services",
        "short_name": "Home Nursing",
        "category": "nursing",
        "icon": "Stethoscope",
        "image_url": "/images/services/home-nursing.svg",
        "excerpt": "Certified nurses at home for wound care, injections, IV therapy, vitals monitoring and post-operative care.",
        "description": "Hospital-quality nursing at home. Our certified nurses handle clinical procedures under physician guidance — safely, hygienically and on schedule — so recovery can happen where patients heal best: at home.",
        "features": ["Wound care", "Injection administration", "IV therapy", "Vital signs monitoring", "Post-operative care"],
        "included": [
            "Certified nurse (GNM/B.Sc)",
            "Doctor-directed clinical procedures",
            "Vitals tracking with digital reports",
            "Dressing, catheter and tube care",
            "Coordination with treating physician",
        ],
        "pricing_starts_from": 599,
        "pricing_unit": "per visit",
        "related": ["patient-care", "personal-care", "elder-care"],
    },
    {
        "slug": "elder-care",
        "name": "Elder Care",
        "short_name": "Elder Care",
        "category": "elder_care",
        "icon": "Armchair",
        "image_url": "/images/services/elder-care.svg",
        "excerpt": "Companionship and daily living support for seniors, including dementia, Alzheimer’s and stroke-recovery care.",
        "description": "Growing old at home, surrounded by family, is a blessing — and our elder-care team makes it safe and joyful. We combine companionship with specialised support for age-related conditions, so seniors live with dignity and families live with peace of mind.",
        "features": ["Companionship", "Daily living assistance", "Dementia care", "Alzheimer's support", "Stroke recovery"],
        "included": [
            "Compassionate, verified caregiver",
            "Companionship and engagement activities",
            "Memory-care routines for dementia/Alzheimer’s",
            "Mobility and fall-prevention support",
            "Regular health and mood updates to family",
        ],
        "pricing_starts_from": 449,
        "pricing_unit": "per day",
        "related": ["personal-care", "patient-care", "day-care"],
    },
    {
        "slug": "patient-care",
        "name": "Patient Care",
        "short_name": "Patient Care",
        "category": "patient_care",
        "icon": "BedDouble",
        "image_url": "/images/services/patient-care.svg",
        "excerpt": "Round-the-clock care for bedridden patients, chronic illness management, palliative care and rehabilitation.",
        "description": "For patients who need continuous attention, our patient-care attendants provide skilled, empathetic support — managing chronic conditions, preventing complications and keeping patients comfortable through recovery or long-term care.",
        "features": ["Bedridden patient care", "Chronic illness management", "Palliative care", "Rehabilitation support"],
        "included": [
            "Trained patient-care attendant",
            "Positioning and bedsore prevention",
            "Feeding, hygiene and medication support",
            "Chronic-condition monitoring",
            "Rehabilitation exercise assistance",
        ],
        "pricing_starts_from": 799,
        "pricing_unit": "per day",
        "related": ["home-nursing", "elder-care", "personal-care"],
    },
    {
        "slug": "child-care",
        "name": "Child Care Services",
        "short_name": "Child Care",
        "category": "child_care",
        "icon": "Baby",
        "image_url": "/images/services/child-care.svg",
        "excerpt": "Gentle, attentive care for infants and children — including special-needs support and post-surgery care.",
        "description": "From newborns to children with special needs, our child-care professionals bring training, patience and genuine affection. We support your child’s health, nutrition and development while you balance work and family.",
        "features": ["Infant care", "Special needs children", "Post-surgery care", "Nutritious meals", "Development activities", "Medicine reminders"],
        "included": [
            "Background-verified child-care professional",
            "Infant feeding, bathing and sleep routines",
            "Special-needs and post-surgery support",
            "Age-appropriate learning activities",
            "Meal planning and medicine schedules",
        ],
        "pricing_starts_from": 399,
        "pricing_unit": "per day",
        "related": ["day-care", "personal-care", "home-nursing"],
    },
    {
        "slug": "day-care",
        "name": "Day Care Services",
        "short_name": "Day Care",
        "category": "day_care",
        "icon": "Sun",
        "image_url": "/images/services/day-care.svg",
        "excerpt": "A safe, supervised day-care environment with health monitoring, timely meals and engaging activity programs.",
        "description": "Our day-care service offers families a trusted place for loved ones to spend the day — or full 24-hour care when needed. Health supervision, nutritious meals, rest and social activities are all part of a structured, caring routine.",
        "features": ["Full day care (24 hours)", "Rest & health monitoring", "Timely meals", "Health supervision", "Activity programs"],
        "included": [
            "Safe, supervised care environment",
            "Round-the-clock health monitoring",
            "Nutritious meals and hydration schedule",
            "Recreation and social activities",
            "Daily reports to family members",
        ],
        "pricing_starts_from": 899,
        "pricing_unit": "per day",
        "related": ["elder-care", "child-care", "patient-care"],
    },
]

PACKAGES = [
    {
        "type": "hourly",
        "name": "Hourly Care",
        "icon": "Clock",
        "price": 249,
        "price_unit": "per hour",
        "duration": "Minimum 4 hours",
        "description": "Flexible, on-demand care for appointments, errands or short daily support.",
        "features": ["Minimum 4 hours", "Flexible scheduling", "Same-day booking available"],
        "what_included": [
            "Trained caregiver or attendant",
            "Personal care and companionship",
            "Medication reminders",
            "Activity/visit report after each session",
        ],
        "staff_assignment": "Caregiver matched per visit",
        "support_hours": "Office-hours phone support",
        "popular": False,
    },
    {
        "type": "daily",
        "name": "Daily Care",
        "icon": "SunMedium",
        "price": 1199,
        "price_unit": "per day",
        "duration": "8–12 hours coverage",
        "description": "Dependable day or night shifts for consistent daily support at home.",
        "features": ["8–12 hours coverage", "Day/night shifts", "Daily care log"],
        "what_included": [
            "Dedicated caregiver per shift",
            "Personal care, meals and mobility support",
            "Vitals check (once per shift)",
            "Daily WhatsApp update to family",
        ],
        "staff_assignment": "Consistent caregiver, backup guaranteed",
        "support_hours": "Extended-hours phone support",
        "popular": False,
    },
    {
        "type": "weekly",
        "name": "Weekly Care",
        "icon": "CalendarDays",
        "price": 7499,
        "price_unit": "per week",
        "duration": "7-day support",
        "description": "A full week of structured care with health reporting and supervisor reviews.",
        "features": ["7-day support", "Weekly health reports", "Supervisor visit included"],
        "what_included": [
            "Dedicated caregiver, 7 days",
            "Weekly nursing supervisor review",
            "Weekly health report (PDF)",
            "Care-plan adjustments as needed",
        ],
        "staff_assignment": "Dedicated caregiver + supervisor",
        "support_hours": "24/7 phone support",
        "popular": True,
    },
    {
        "type": "monthly",
        "name": "Monthly Care",
        "icon": "CalendarRange",
        "price": 24999,
        "price_unit": "per month",
        "duration": "Complete home healthcare",
        "description": "Comprehensive, uninterrupted home healthcare with a dedicated care team.",
        "features": ["Complete home healthcare", "Dedicated staff", "Best value"],
        "what_included": [
            "Dedicated care team (caregiver + nurse oversight)",
            "Monthly doctor tele-review",
            "All consumables coordination",
            "Detailed monthly health report",
            "Priority emergency response",
        ],
        "staff_assignment": "Dedicated team with planned rotation",
        "support_hours": "24/7 priority support",
        "popular": False,
    },
    {
        "type": "custom",
        "name": "Custom Plans",
        "icon": "Settings2",
        "price": None,
        "price_unit": "Get quote",
        "duration": "Tailored to needs",
        "description": "Every family is different. Tell us what you need — we will build the plan around it.",
        "features": ["Tailored to needs", "Consultation required", "Mix of services"],
        "what_included": [
            "Free in-person assessment",
            "Personalised care plan document",
            "Flexible service combinations",
            "Transparent custom pricing",
        ],
        "staff_assignment": "Matched to your care plan",
        "support_hours": "As per plan",
        "popular": False,
    },
]

TEAM = [
    {
        "slug": "dr-ananya-rao", "name": "Dr. Ananya Rao", "designation": "Medical Director",
        "category": "doctors", "role_category": "leadership",
        "specialization": "General & Geriatric Medicine",
        "qualifications": "MBBS, MD (General Medicine)", "experience": "15+ years",
        "languages": ["Telugu", "English", "Hindi"], "photo_url": "/images/team/doctor-1.svg",
        "bio": "Leads our clinical protocols and care-plan reviews, ensuring every patient receives hospital-grade oversight at home.",
    },
    {
        "slug": "dr-vikram-menon", "name": "Dr. Vikram Menon", "designation": "Consultant Physician",
        "category": "doctors", "role_category": "medical",
        "specialization": "Internal Medicine & Palliative Care",
        "qualifications": "MBBS, DNB", "experience": "12 years",
        "languages": ["English", "Malayalam", "Tamil"], "photo_url": "/images/team/doctor-2.svg",
        "bio": "Guides our palliative and chronic-illness programs with a focus on comfort and quality of life.",
    },
    {
        "slug": "sr-priya-kumari", "name": "Priya Kumari", "designation": "Head Nurse",
        "category": "nurses", "role_category": "medical",
        "specialization": "Post-operative & Wound Care",
        "qualifications": "B.Sc Nursing, RN", "experience": "10 years",
        "languages": ["Telugu", "English"], "photo_url": "/images/team/nurse-1.svg",
        "bio": "Trains and supervises our nursing team; specialist in complex wound management and IV therapy.",
    },
    {
        "slug": "sr-mary-joseph", "name": "Mary Joseph", "designation": "Senior Nurse",
        "category": "nurses", "role_category": "medical",
        "specialization": "Critical & Elderly Care",
        "qualifications": "GNM, Certified in Geriatric Care", "experience": "8 years",
        "languages": ["English", "Malayalam", "Telugu"], "photo_url": "/images/team/nurse-2.svg",
        "bio": "Known among families for calm, meticulous care of elderly and critical patients.",
    },
    {
        "slug": "sr-kavitha-n", "name": "Kavitha N", "designation": "Staff Nurse",
        "category": "nurses", "role_category": "medical",
        "specialization": "Pediatric & Infant Care",
        "qualifications": "GNM", "experience": "6 years",
        "languages": ["Telugu", "Tamil"], "photo_url": "/images/team/nurse-3.svg",
        "bio": "Our go-to nurse for newborn care, immunisation schedules and child-health guidance.",
    },
    {
        "slug": "cg-ramesh-babu", "name": "Ramesh Babu", "designation": "Senior Caregiver",
        "category": "caregivers", "role_category": "support",
        "specialization": "Bedridden & Stroke Patients",
        "qualifications": "Certified Home Health Aide", "experience": "9 years",
        "languages": ["Telugu", "Hindi"], "photo_url": "/images/team/caregiver-1.svg",
        "bio": "Nine years of dependable bedside care — trusted by long-term patients across Chittoor.",
    },
    {
        "slug": "cg-sunitha-devi", "name": "Sunitha Devi", "designation": "Caregiver",
        "category": "caregivers", "role_category": "support",
        "specialization": "Dementia & Elder Companionship",
        "qualifications": "Certified Caregiver, Dementia Care Trained", "experience": "7 years",
        "languages": ["Telugu", "Kannada"], "photo_url": "/images/team/caregiver-2.svg",
        "bio": "Combines patience and warmth in memory care; families call her \"a second daughter\".",
    },
    {
        "slug": "pt-arjun-varma", "name": "Arjun Varma", "designation": "Physiotherapist",
        "category": "physiotherapists", "role_category": "medical",
        "specialization": "Neuro & Ortho Rehabilitation",
        "qualifications": "BPT, MPT (Neuro)", "experience": "8 years",
        "languages": ["Telugu", "English", "Hindi"], "photo_url": "/images/team/physio-1.svg",
        "bio": "Designs home rehabilitation programs for stroke, post-surgery and mobility recovery.",
    },
    {
        "slug": "st-lakshmi-prasanna", "name": "Lakshmi Prasanna", "designation": "Care Coordinator",
        "category": "support", "role_category": "leadership",
        "specialization": "Care Planning & Family Liaison",
        "qualifications": "MBA (Hospital Administration)", "experience": "6 years",
        "languages": ["Telugu", "English"], "photo_url": "/images/team/support-1.svg",
        "bio": "Your single point of contact — matches caregivers, schedules visits and keeps families informed.",
    },
    {
        "slug": "st-mohammed-imran", "name": "Mohammed Imran", "designation": "Operations Executive",
        "category": "support", "role_category": "support",
        "specialization": "Scheduling & Emergency Response",
        "qualifications": "B.Com", "experience": "4 years",
        "languages": ["Telugu", "Urdu", "Hindi"], "photo_url": "/images/team/support-2.svg",
        "bio": "Keeps our 24/7 roster running and coordinates rapid response for urgent requests.",
    },
]

TESTIMONIALS = [
    {
        "seed_key": "t1", "customer_name": "Suresh Chandra", "relation": "Son of patient",
        "service_used": "Elder Care", "rating": 5, "photo_url": "/images/avatars/avatar-1.svg",
        "is_verified": True, "is_featured": True,
        "review": "My father is 82 and lives alone in Chittoor while I work in Bengaluru. Dhrishta’s caregiver has become family to him. Daily WhatsApp updates give me complete peace of mind.",
    },
    {
        "seed_key": "t2", "customer_name": "Padmavathi R", "relation": "Daughter of patient",
        "service_used": "Home Nursing", "rating": 5, "photo_url": "/images/avatars/avatar-2.svg",
        "is_verified": True, "is_featured": True,
        "review": "After my mother’s surgery, their nurse handled dressings and injections at home with such professionalism. The wound healed without a single complication.",
    },
    {
        "seed_key": "t3", "customer_name": "Kiran Kumar", "relation": "Family member",
        "service_used": "Patient Care", "rating": 5, "photo_url": "/images/avatars/avatar-3.svg",
        "is_verified": True, "is_featured": True,
        "review": "For 11 months their attendant cared for my bedridden uncle — repositioning, feeding, hygiene, everything on schedule. No bedsores, ever. That says it all.",
    },
    {
        "seed_key": "t4", "customer_name": "Anitha & Ravi Teja", "relation": "Parents",
        "service_used": "Child Care", "rating": 5, "photo_url": "/images/avatars/avatar-4.svg",
        "is_verified": True, "is_featured": False,
        "review": "Our son has special needs and we were nervous about outside help. Their child-care professional was patient, skilled and genuinely loving. He looks forward to her visits now.",
    },
    {
        "seed_key": "t5", "customer_name": "Venkatesh Prasad", "relation": "Son of patient",
        "service_used": "Personal Care", "rating": 4, "photo_url": "/images/avatars/avatar-5.svg",
        "is_verified": True, "is_featured": False,
        "review": "Punctual, respectful and very careful with my mother’s morning routine. Booking and rescheduling on WhatsApp is effortless.",
    },
    {
        "seed_key": "t6", "customer_name": "Grace Williams", "relation": "Granddaughter",
        "service_used": "Day Care", "rating": 5, "photo_url": "/images/avatars/avatar-6.svg",
        "is_verified": True, "is_featured": False,
        "review": "Grandma spends her days at Dhrishta’s day care — meals on time, health checks, activities and friends. She comes home happy every evening.",
    },
]

GALLERY = [
    ("g1", "facilities", "Care Environment", "Clean, calm spaces designed for comfort and recovery.", "/images/gallery/facilities-1.svg"),
    ("g2", "facilities", "Medical Equipment", "Modern equipment for safe home and day care.", "/images/gallery/facilities-2.svg"),
    ("g3", "facilities", "Rest Areas", "Comfortable rest areas for day-care guests.", "/images/gallery/facilities-3.svg"),
    ("g4", "daily_activities", "Patient Care Moments", "Everyday care delivered with warmth.", "/images/gallery/daily-activities-1.svg"),
    ("g5", "daily_activities", "Exercise Sessions", "Guided mobility and light exercise.", "/images/gallery/daily-activities-2.svg"),
    ("g6", "daily_activities", "Meal Times", "Nutritious meals served on schedule.", "/images/gallery/daily-activities-3.svg"),
    ("g7", "care_programs", "Therapy Sessions", "Physiotherapy and rehabilitation programs.", "/images/gallery/care-programs-1.svg"),
    ("g8", "care_programs", "Special Care", "Specialised dementia and palliative programs.", "/images/gallery/care-programs-2.svg"),
    ("g9", "care_programs", "Health Monitoring", "Regular vitals tracking and reviews.", "/images/gallery/care-programs-3.svg"),
    ("g10", "events", "Celebrations", "Festivals and birthdays celebrated together.", "/images/gallery/events-1.svg"),
    ("g11", "events", "Health Camps", "Free community health-check camps.", "/images/gallery/events-2.svg"),
    ("g12", "events", "Family Meetups", "Bringing families and caregivers together.", "/images/gallery/events-3.svg"),
    ("g13", "team", "Our Care Team", "The people behind Dhrishta’s promise.", "/images/gallery/team-1.svg"),
    ("g14", "team", "Team in Action", "Caregivers and nurses at work.", "/images/gallery/team-2.svg"),
    ("g15", "team", "Training Sessions", "Continuous skill development for our staff.", "/images/gallery/team-3.svg"),
    ("g16", "day_care", "Day Care Facilities", "A safe, welcoming day-care environment.", "/images/gallery/day-care-1.svg"),
    ("g17", "day_care", "Activity Areas", "Engaging activity and recreation zones.", "/images/gallery/day-care-2.svg"),
    ("g18", "day_care", "Community Time", "Friendship and connection every day.", "/images/gallery/day-care-3.svg"),
]


async def seed() -> None:
    """Upsert all seed documents."""
    db = get_db()
    if not await ping():
        print(f"ERROR: cannot reach MongoDB at {settings.mongo_url}. Aborting.")
        sys.exit(1)

    now = utcnow()

    for order, svc in enumerate(SERVICES):
        await db.services.update_one(
            {"slug": svc["slug"]},
            {"$set": {**svc, "is_active": True, "display_order": order}},
            upsert=True,
        )
    print(f"Seeded {len(SERVICES)} services.")

    for order, pkg in enumerate(PACKAGES):
        await db.packages.update_one(
            {"type": pkg["type"]},
            {"$set": {**pkg, "display_order": order}},
            upsert=True,
        )
    print(f"Seeded {len(PACKAGES)} packages.")

    for order, member in enumerate(TEAM):
        await db.team_members.update_one(
            {"slug": member["slug"]},
            {"$set": {**member, "is_active": True, "display_order": order}},
            upsert=True,
        )
    print(f"Seeded {len(TEAM)} team members.")

    for testimonial in TESTIMONIALS:
        key = testimonial["seed_key"]
        await db.testimonials.update_one(
            {"seed_key": key},
            {
                "$set": {**testimonial, "status": "approved"},
                "$setOnInsert": {"created_at": now},
            },
            upsert=True,
        )
    print(f"Seeded {len(TESTIMONIALS)} approved testimonials.")

    for order, (key, category, title, description, image_url) in enumerate(GALLERY):
        await db.gallery.update_one(
            {"seed_key": key},
            {
                "$set": {
                    "seed_key": key,
                    "title": title,
                    "image_url": image_url,
                    "category": category,
                    "description": description,
                    "display_order": order,
                    "is_active": True,
                },
                "$setOnInsert": {"uploaded_at": now},
            },
            upsert=True,
        )
    print(f"Seeded {len(GALLERY)} gallery images.")

    admin_password = os.environ.get("SEED_ADMIN_PASSWORD", settings.seed_admin_password)
    result = await db.users.update_one(
        {"email": ADMIN_EMAIL},
        {
            "$set": {
                "name": "Dhrishta Admin",
                "role": "admin",
                "phone": constants.COMPANY_PHONE,
                "is_active": True,
            },
            "$setOnInsert": {
                "email": ADMIN_EMAIL,
                "password": hash_password(admin_password),
                "created_at": now,
                "last_login": None,
            },
        },
        upsert=True,
    )
    if result.upserted_id is not None:
        print(f"Created admin user {ADMIN_EMAIL}.")
        if admin_password == "ChangeMe@123":
            print("WARNING: admin user uses the default password 'ChangeMe@123'. "
                  "Set SEED_ADMIN_PASSWORD and change it immediately after first login.")
    else:
        print(f"Admin user {ADMIN_EMAIL} already exists (password unchanged).")

    print("Seeding complete.")


if __name__ == "__main__":
    asyncio.run(seed())
