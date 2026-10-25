from fastapi import Request
from fastapi.responses import JSONResponse
import structlog

logger = structlog.get_logger()

class ElexonAPIError(Exception):
    def __init__(self, message: str, status_code: int = 502):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class DataNotFoundError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

# ── FastAPI exception handlers ──────────────────────────────────────────────

async def elexon_api_error_handler(request: Request, exc: ElexonAPIError):
    logger.error("elexon_api_error", path=request.url.path, detail=exc.message)
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "upstream_error", "detail": exc.message},
    )

async def data_not_found_handler(request: Request, exc: DataNotFoundError):
    return JSONResponse(
        status_code=404,
        content={"error": "not_found", "detail": exc.message},
    )

async def generic_error_handler(request: Request, exc: Exception):
    logger.exception("unhandled_error", path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={"error": "internal_error", "detail": "An unexpected error occurred."},
    )