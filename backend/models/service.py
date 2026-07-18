"""Pydantic schemas for the `services` collection."""

from typing import Literal

from pydantic import BaseModel, Field

ServiceCategory = Literal[
    "personal_care", "nursing", "elder_care", "patient_care", "child_care", "day_care"
]


class ServiceBase(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    slug: str = Field(min_length=2, max_length=100, pattern=r"^[a-z0-9-]+$")
    category: ServiceCategory
    description: str = ""
    features: list[str] = Field(default_factory=list)
    pricing_starts_from: float | None = None
    icon: str | None = None
    image_url: str | None = None
    is_active: bool = True
    display_order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: str | None = None
    category: ServiceCategory | None = None
    description: str | None = None
    features: list[str] | None = None
    pricing_starts_from: float | None = None
    icon: str | None = None
    image_url: str | None = None
    is_active: bool | None = None
    display_order: int | None = None


class ServiceResponse(ServiceBase):
    id: str
