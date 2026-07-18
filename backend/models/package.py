"""Pydantic schemas for the `packages` collection."""

from typing import Literal

from pydantic import BaseModel, Field

PackageType = Literal["hourly", "daily", "weekly", "monthly", "custom"]


class PackageBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    type: PackageType
    description: str = ""
    price: float | None = None
    duration: str | None = None
    features: list[str] = Field(default_factory=list)
    what_included: list[str] = Field(default_factory=list)
    staff_assignment: str | None = None
    support_hours: str | None = None
    popular: bool = False
    display_order: int = 0


class PackageCreate(PackageBase):
    pass


class PackageUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    duration: str | None = None
    features: list[str] | None = None
    what_included: list[str] | None = None
    staff_assignment: str | None = None
    support_hours: str | None = None
    popular: bool | None = None
    display_order: int | None = None


class PackageResponse(PackageBase):
    id: str
