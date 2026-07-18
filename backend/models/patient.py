"""Pydantic schemas for the `patients` collection (care records)."""

from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from utils.validators import validate_phone


class EmergencyContact(BaseModel):
    name: str
    phone: str
    relationship: str | None = None

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return validate_phone(v)


class CareNote(BaseModel):
    note: str = Field(min_length=1, max_length=2000)
    author: str | None = None
    timestamp: datetime | None = None


class PatientBase(BaseModel):
    booking_id: str | None = None  # ObjectId of the originating booking (as str)
    name: str = Field(min_length=2, max_length=100)
    age: int | None = Field(default=None, ge=0, le=120)
    gender: str | None = None
    medical_history: str | None = None
    current_medications: list[str] = Field(default_factory=list)
    allergies: list[str] = Field(default_factory=list)
    emergency_contact: EmergencyContact | None = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    name: str | None = None
    age: int | None = None
    gender: str | None = None
    medical_history: str | None = None
    current_medications: list[str] | None = None
    allergies: list[str] | None = None
    emergency_contact: EmergencyContact | None = None


class CareNoteCreate(BaseModel):
    note: str = Field(min_length=1, max_length=2000)


class PatientResponse(PatientBase):
    id: str
    care_notes: list[CareNote] = Field(default_factory=list)
    created_at: datetime | None = None
