"""Pydantic schemas for the `gallery` collection."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

GalleryCategory = Literal[
    "facilities", "daily_activities", "care_programs", "events", "team", "day_care"
]


class GalleryImageBase(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    image_url: str = Field(min_length=1)
    category: GalleryCategory
    description: str | None = None
    display_order: int = 0
    is_active: bool = True


class GalleryImageCreate(GalleryImageBase):
    pass


class GalleryImageUpdate(BaseModel):
    title: str | None = None
    image_url: str | None = None
    category: GalleryCategory | None = None
    description: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


class GalleryImageResponse(GalleryImageBase):
    id: str
    uploaded_at: datetime | None = None
