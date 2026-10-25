from pydantic import BaseModel
from datetime import date

class HourlyComparisonPoint(BaseModel):
    start_time: str                  # ISO string for JSON serialisation
    actual_generation_mw: float
    forecast_generation_mw: float
    error_mw: float                  # actual - forecast
    absolute_error_mw: float

class DailyMetrics(BaseModel):
    date: str
    mae_mw: float                    # Mean Absolute Error
    rmse_mw: float                   # Root Mean Square Error
    mape_pct: float | None           # Mean Absolute Percentage Error (None if actual=0)
    bias_mw: float                   # Mean signed error (positive = under-forecast)
    count: int

class OverallMetrics(BaseModel):
    mae_mw: float
    rmse_mw: float
    mape_pct: float | None
    bias_mw: float
    count: int

class AccuracyResponse(BaseModel):
    overall: OverallMetrics
    daily: list[DailyMetrics]
    hourly_comparison: list[HourlyComparisonPoint]