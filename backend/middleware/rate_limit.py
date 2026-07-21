"""Dependency-free in-memory per-IP rate limiting for POST endpoints.

A sliding one-minute window is kept per client IP. Suitable for a single
process; swap for a shared store (e.g. Redis) when scaling horizontally.
"""

import time
from collections import defaultdict, deque

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

WINDOW_SECONDS = 60
MAX_POSTS_PER_WINDOW = 30
# Credential endpoints get a much tighter budget — brute-force protection.
MAX_AUTH_POSTS_PER_WINDOW = 5
_AUTH_PATHS = ("/api/auth/login",)

# X-Forwarded-For is only meaningful when the direct peer is our own proxy;
# trusting it from arbitrary clients lets an attacker rotate fake IPs.
_TRUSTED_PROXY_PREFIXES = ("127.", "10.", "172.", "192.168.", "::1")


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Reject POST requests exceeding the per-IP sliding-window budget."""

    def __init__(self, app, limit: int = MAX_POSTS_PER_WINDOW, window: int = WINDOW_SECONDS):
        super().__init__(app)
        self.limit = limit
        self.window = window
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    def _client_ip(self, request: Request) -> str:
        peer = request.client.host if request.client else "unknown"
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded and peer.startswith(_TRUSTED_PROXY_PREFIXES):
            return forwarded.split(",")[0].strip()
        return peer

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if request.method != "POST":
            return await call_next(request)

        path = request.url.path
        is_auth = any(path.startswith(p) for p in _AUTH_PATHS)
        limit = MAX_AUTH_POSTS_PER_WINDOW if is_auth else self.limit
        bucket = f"auth|{self._client_ip(request)}" if is_auth else self._client_ip(request)

        now = time.monotonic()
        hits = self._hits[bucket]
        while hits and now - hits[0] > self.window:
            hits.popleft()

        if len(hits) >= limit:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again in a minute."},
                headers={"Retry-After": str(self.window)},
            )

        hits.append(now)
        return await call_next(request)
