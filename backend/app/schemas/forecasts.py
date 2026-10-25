from pydantic import BaseModel
from datetime import datetime

class ForecastPoint(BaseModel):
    start_time: datetime
    publish_time: datetime
    generation_mw: float

class LatestForecastPoint(BaseModel):
    start_time: datetime
    forecast_generation_mw: float
    forecast_publish_time: datetime  # When this forecast was made

class ForecastsResponse(BaseModel):
    data: list[LatestForecastPoint]
    total_records: int
    decision_cutoff_hour_utc: int
    description: str