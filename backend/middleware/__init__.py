"""Middleware package: auth dependencies, CORS, error handlers, rate limiting."""

from middleware.auth_middleware import get_current_user, require_admin
from middleware.cors_middleware import setup_cors
from middleware.error_handler import register_error_handlers
from middleware.rate_limit import RateLimitMiddleware
from middleware.security_headers import SecurityHeadersMiddleware

__all__ = [
    "get_current_user",
    "require_admin",
    "setup_cors",
    "register_error_handlers",
    "RateLimitMiddleware",
    "SecurityHeadersMiddleware",
]
