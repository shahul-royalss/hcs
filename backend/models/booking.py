"""Pydantic schemas for the `bookings` collection."""

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

from utils.validators import validate_phone, validate_pincode

PackageType = Literal["hourly", "daily", "weekly", "monthly", "custom"]
BookingStatus = Literal["pending", "confirmed", "in_progress", "completed", "cancelled"]


class PatientInfo(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    age: int | None = Field(default=None, ge=0, le=120)
    gender: str | None = None
    medical_condition: str | None = None
    special_requirements: str | None = None


class ContactInfo(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    relationship: str | None = None
    phone: str
    email: EmailStr | None = None
    address: str = Field(min_length=5, max_length=500)
    pincode: str

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return validate_phone(v)

    @field_validator("pincode")
    @classmethod
    def _pincode(cls, v: str) -> str:
        return validate_pincode(v)


class BookingSchedule(BaseModel):
    start_date: date
    time_slot: str | None = None
    duration: str | None = None
    urgency: Literal["normal", "urgent"] = "normal"


class StaffPreference(BaseModel):
    gender: str | None = None
    language: str | None = None
    experience_level: str | None = None


class PaymentInfo(BaseModel):
    amount: float | None = None
    advance_paid: float = 0
    payment_status: Literal["pending", "paid", "partial"] = "pending"
    payment_method: str | None = None
    transaction_id: str | None = None


class BookingCreate(BaseModel):
    service_type: str = Field(min_length=2, max_length=100)
    package_type: PackageType
    specialty: str | None = None
    patient_info: PatientInfo
    contact_info: ContactInfo
    schedule: BookingSchedule
    staff_preference: StaffPreference = Field(default_factory=StaffPreference)
    notes: str | None = None


class BookingUpdate(BaseModel):
    """Partial update used by PUT /api/admin/bookings/{id}."""

    service_type: str | None = None
    package_type: PackageType | None = None
    specialty: str | None = None
    patient_info: PatientInfo | None = None
    contact_info: ContactInfo | None = None
    schedule: BookingSchedule | None = None
    staff_preference: StaffPreference | None = None
    status: BookingStatus | None = None
    payment: PaymentInfo | None = None
    notes: str | None = None


class AssignStaffRequest(BaseModel):
    staff_id: str = Field(min_length=1)


class ServiceAreaRequest(BaseModel):
    pincode: str

    @field_validator("pincode")
    @classmethod
    def _pincode(cls, v: str) -> str:
        return validate_pincode(v)


class BookingCreateResponse(BaseModel):
    booking_id: str
    status: BookingStatus
    message: str
    estimated_cost: float | None = None


class BookingResponse(BaseModel):
    """Serialised booking document returned to the admin portal."""

    id: str
    booking_id: str
    service_type: str
    package_type: PackageType
    specialty: str | None = None
    patient_info: PatientInfo
    contact_info: ContactInfo
    schedule: dict
    staff_preference: StaffPreference | None = None
    assigned_staff_id: str | None = None
    status: BookingStatus
    payment: PaymentInfo
    created_at: datetime | None = None
    updated_at: datetime | None = None
    notes: str | None = None
