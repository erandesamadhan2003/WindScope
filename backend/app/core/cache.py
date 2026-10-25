import time
from typing import Any, Optional

class TTLCache:
    """
    Simple in-memory TTL cache.
    In production you'd swap this for Redis, but this is sufficient
    since Jan 2026 data is static and we're a single-instance app.
    """

    def __init__(self, ttl_seconds: int = 3600):
        self._store: dict[str, tuple[Any, float]] = {}
        self._ttl = ttl_seconds

    def get(self, key: str) -> Optional[Any]:
        if key in self._store:
            value, expires_at = self._store[key]
            if time.time() < expires_at:
                return value
            del self._store[key]
        return None

    def set(self, key: str, value: Any) -> None:
        self._store[key] = (value, time.time() + self._ttl)

    def clear(self) -> None:
        self._store.clear()


# Singleton cache instance used across the app
cache = TTLCache()