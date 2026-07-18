"""Pydantic schemas for the `testimonials` collection."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

TestimonialStatus = Literal["pending", "approved", "rejected"]


class TestimonialBase(BaseModel):
    customer_name: str = Field(min_length=2, max_length=100)
    service_used: str | None = None
    rating: int = Field(ge=1, le=5)
    review: str = Field(min_length=5, max_length=2000)
    photo_url: str | None = None


class TestimonialCreate(TestimonialBase):
    """Public submission — always stored as pending until approved."""


class TestimonialUpdate(BaseModel):
    customer_name: str | None = None
    service_used: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    review: str | None = None
    photo_url: str | None = None
    is_verified: bool | None = None
    is_featured: bool | None = None
    status: TestimonialStatus | None = None


class TestimonialResponse(TestimonialBase):
    id: str
    is_verified: bool = False
    is_featured: bool = False
    status: TestimonialStatus = "pending"
    created_at: datetime | None = None
