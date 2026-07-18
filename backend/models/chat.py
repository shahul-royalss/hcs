"""Pydantic schemas for the `chat_conversations` collection and chat API."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from utils.validators import validate_phone


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    timestamp: datetime | None = None


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    session_id: str | None = Field(default=None, max_length=64)
    user_phone: str | None = None

    @field_validator("user_phone")
    @classmethod
    def _phone(cls, v: str | None) -> str | None:
        return validate_phone(v) if v else v


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    source: Literal["ai", "fallback"] = "fallback"


class ChatSessionResponse(BaseModel):
    session_id: str
    messages: list[ChatMessage] = Field(default_factory=list)
    status: Literal["active", "ended"] = "active"
    created_at: datetime | None = None
    updated_at: datetime | None = None
