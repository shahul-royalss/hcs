"""Pydantic schemas for the `contacts` collection (inquiries, callbacks, emergencies)."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

from utils.validators import validate_phone

ContactStatus = Literal["new", "contacted", "converted", "closed"]


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr | None = None
    phone: str
    service_interested: str | None = None
    message: str = Field(min_length=1, max_length=3000)
    preferred_contact_time: str | None = None

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return validate_phone(v)


class CallbackRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str
    preferred_contact_time: str | None = None
    service_interested: str | None = None

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return validate_phone(v)


class EmergencyRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str
    address: str | None = None
    message: str | None = None

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return validate_phone(v)


class ContactUpdate(BaseModel):
    status: ContactStatus | None = None
    notes: str | None = None


class ContactResponse(BaseModel):
    id: str
    name: str
    email: EmailStr | None = None
    phone: str
    service_interested: str | None = None
    message: str | None = None
    preferred_contact_time: str | None = None
    status: ContactStatus = "new"
    created_at: datetime | None = None
    notes: str | None = None
