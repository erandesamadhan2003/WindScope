from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.core.logging import setup_logging
from app.core.exceptions import (
    ElexonAPIError, DataNotFoundError,
    elexon_api_error_handler, data_not_found_handler, generic_error_handler,
)
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging(debug=settings.DEBUG)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "API powering the Wind Energy Procurement Dashboard. "
        "Provides wind generation actuals, day-ahead forecasts, and "
        "forecast accuracy metrics for January 2026."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Exception handlers ────────────────────────────────────────────────────────
app.add_exception_handler(ElexonAPIError, elexon_api_error_handler)
app.add_exception_handler(DataNotFoundError, data_not_found_handler)
app.add_exception_handler(Exception, generic_error_handler)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(api_router, prefix="/api/v1")