from fastapi import APIRouter
from app.api.v1.endpoints import health, actuals, forecasts, accuracy

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(actuals.router, tags=["Actuals"])
api_router.include_router(forecasts.router, tags=["Forecasts"])
api_router.include_router(accuracy.router, tags=["Accuracy"])