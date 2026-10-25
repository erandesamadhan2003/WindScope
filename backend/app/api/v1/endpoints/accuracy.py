from fastapi import APIRouter, Query
from app.services.accuracy_service import accuracy_service
from app.schemas.accuracy import AccuracyResponse
from app.config import settings

router = APIRouter()

@router.get("/accuracy", response_model=AccuracyResponse)
async def get_accuracy(
    from_date: str = Query(default=None),
    to_date: str = Query(default=None),
):
    return await accuracy_service.get_accuracy(
        from_date=from_date or settings.DATA_FROM,
        to_date=to_date or settings.DATA_TO,
    )