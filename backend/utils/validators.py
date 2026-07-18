"""Reusable input validators (phone, pincode) shared by models and routes."""

import re

_PHONE_RE = re.compile(r"^(?:\+91[\-\s]?|0)?[6-9]\d{9}$")
_PINCODE_RE = re.compile(r"^\d{6}$")


def is_valid_indian_phone(phone: str) -> bool:
    """True for a 10-digit Indian mobile number, optionally prefixed +91 or 0."""
    return bool(_PHONE_RE.fullmatch(phone.strip()))


def normalize_phone(phone: str) -> str:
    """Normalise an Indian phone number to +91XXXXXXXXXX form."""
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    elif len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]
    return f"+91{digits}"


def validate_phone(phone: str) -> str:
    """Pydantic-style validator: raise ValueError for bad phones, else normalise."""
    if not is_valid_indian_phone(phone):
        raise ValueError("Enter a valid 10-digit Indian mobile number (optional +91).")
    return normalize_phone(phone)


def is_valid_pincode(pincode: str) -> bool:
    """True for a 6-digit Indian pincode."""
    return bool(_PINCODE_RE.fullmatch(pincode.strip()))


def validate_pincode(pincode: str) -> str:
    """Pydantic-style validator: raise ValueError for bad pincodes."""
    pincode = pincode.strip()
    if not is_valid_pincode(pincode):
        raise ValueError("Pincode must be exactly 6 digits.")
    return pincode
