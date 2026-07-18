"""Pydantic schemas for the `users` collection (admin/staff portal accounts)."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

from utils.validators import validate_phone

Role = Literal["admin", "staff", "manager"]


class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2, max_length=100)
    role: Role = "staff"
    phone: str | None = None

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str | None) -> str | None:
        return validate_phone(v) if v else v


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserResponse(UserBase):
    id: str
    is_active: bool = True
    created_at: datetime | None = None
    last_login: datetime | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: UserResponse
