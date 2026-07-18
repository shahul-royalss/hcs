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


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Reject POST requests exceeding MAX_POSTS_PER_WINDOW per IP per minute."""

    def __init__(self, app, limit: int = MAX_POSTS_PER_WINDOW, window: int = WINDOW_SECONDS):
        super().__init__(app)
        self.limit = limit
        self.window = window
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    def _client_ip(self, request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if request.method != "POST":
            return await call_next(request)

        now = time.monotonic()
        hits = self._hits[self._client_ip(request)]
        while hits and now - hits[0] > self.window:
            hits.popleft()

        if len(hits) >= self.limit:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again in a minute."},
                headers={"Retry-After": str(self.window)},
            )

        hits.append(now)
        return await call_next(request)
