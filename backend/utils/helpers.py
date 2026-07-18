"""Common helpers: ObjectId parsing, document serialisation, timestamps."""

from datetime import date, datetime, timezone
from typing import Any

from bson import ObjectId


def utcnow() -> datetime:
    """Timezone-aware current UTC time."""
    return datetime.now(timezone.utc)


def parse_object_id(value: str) -> ObjectId | None:
    """Parse a string into an ObjectId, returning None when invalid."""
    return ObjectId(value) if ObjectId.is_valid(value) else None


def serialize_doc(doc: Any) -> Any:
    """Recursively convert Mongo documents into JSON-safe structures.

    - `_id` is renamed to `id` and stringified; nested ObjectIds become strings.
    - datetimes/dates become ISO-8601 strings.
    """
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        out: dict[str, Any] = {}
        for key, value in doc.items():
            if key == "_id":
                out["id"] = str(value)
            else:
                out[key] = serialize_doc(value)
        return out
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, (datetime, date)):
        return doc.isoformat()
    return doc


def clean_update(data: dict[str, Any]) -> dict[str, Any]:
    """Drop None values from a partial-update payload."""
    return {k: v for k, v in data.items() if v is not None}
