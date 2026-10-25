from fastapi import APIRouter, Query
from app.services.forecasts_service import forecasts_service
from app.schemas.forecasts import ForecastsResponse
from app.config import settings

router = APIRouter()

@router.get("/forecasts/latest", response_model=ForecastsResponse)
async def get_latest_forecasts(
    from_date: str = Query(default=None),
    to_date: str = Query(default=None),
):
    return await forecasts_service.get_latest_forecasts(
        from_date=from_date or settings.DATA_FROM,
        to_date=to_date or settings.DATA_TO,
    )