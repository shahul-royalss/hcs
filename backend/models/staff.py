"""Pydantic schemas for the `staff` collection (field workforce, admin-managed)."""

from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

from utils.validators import validate_phone

Designation = Literal["doctor", "nurse", "caregiver", "physiotherapist", "support_staff"]
AvailabilityStatus = Literal["available", "assigned", "on_leave"]


class StaffBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    designation: Designation
    qualifications: str | None = None
    experience_years: int = Field(default=0, ge=0, le=60)
    languages: list[str] = Field(default_factory=list)
    gender: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    photo_url: str | None = None
    specializations: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    availability_status: AvailabilityStatus = "available"
    rating: float = Field(default=0, ge=0, le=5)
    is_active: bool = True

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str | None) -> str | None:
        return validate_phone(v) if v else v


class StaffCreate(StaffBase):
    pass


class StaffUpdate(BaseModel):
    name: str | None = None
    designation: Designation | None = None
    qualifications: str | None = None
    experience_years: int | None = None
    languages: list[str] | None = None
    gender: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    photo_url: str | None = None
    specializations: list[str] | None = None
    certifications: list[str] | None = None
    availability_status: AvailabilityStatus | None = None
    rating: float | None = None
    is_active: bool | None = None

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str | None) -> str | None:
        return validate_phone(v) if v else v


class StaffResponse(StaffBase):
    id: str
