from fastapi import APIRouter, Query
from app.services.actuals_service import actuals_service
from app.schemas.actuals import ActualsResponse
from app.config import settings

router = APIRouter()

@router.get("/actuals", response_model=ActualsResponse)
async def get_actuals(
    from_date: str = Query(default=None, description="ISO date, e.g. 2026-10-24"),
    to_date: str = Query(default=None, description="ISO date, e.g. 2026-10-25"),
):
    return await actuals_service.get_actuals(
        from_date=from_date or settings.DATA_FROM,
        to_date=to_date or settings.DATA_TO,
    )