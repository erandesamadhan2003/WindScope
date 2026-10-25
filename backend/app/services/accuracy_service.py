import math
from collections import defaultdict
from datetime import datetime
from app.services.actuals_service import actuals_service
from app.services.forecasts_service import forecasts_service
from app.schemas.accuracy import (
    HourlyComparisonPoint, DailyMetrics, OverallMetrics, AccuracyResponse
)
from app.core.cache import cache
import structlog

logger = structlog.get_logger()

class AccuracyService:

    async def get_accuracy(self, from_date: str, to_date: str) -> AccuracyResponse:
        cache_key = f"accuracy_{from_date}_{to_date}"
        cached = cache.get(cache_key)
        if cached:
            return cached

        actuals_resp = await actuals_service.get_actuals(from_date, to_date)
        forecasts_resp = await forecasts_service.get_latest_forecasts(from_date, to_date)

        # Aggregate 30-min actuals → hourly average
        hourly_actuals: dict[datetime, list[float]] = defaultdict(list)
        for point in actuals_resp.data:
            hour_key = point.start_time.replace(minute=0, second=0, microsecond=0)
            hourly_actuals[hour_key].append(point.generation_mw)

        actuals_hourly_avg: dict[datetime, float] = {
            hour: sum(vals) / len(vals)
            for hour, vals in hourly_actuals.items()
        }

        forecast_lookup: dict[datetime, float] = {
            p.start_time: p.forecast_generation_mw
            for p in forecasts_resp.data
        }

        hourly_points: list[HourlyComparisonPoint] = []
        for hour, actual_mw in sorted(actuals_hourly_avg.items()):
            if hour not in forecast_lookup:
                continue
            forecast_mw = forecast_lookup[hour]
            error = actual_mw - forecast_mw
            hourly_points.append(HourlyComparisonPoint(
                start_time=hour.isoformat(),
                actual_generation_mw=round(actual_mw, 2),
                forecast_generation_mw=round(forecast_mw, 2),
                error_mw=round(error, 2),
                absolute_error_mw=round(abs(error), 2),
            ))

        if not hourly_points:
            logger.warning("no_overlapping_data")
            response = AccuracyResponse(
                overall=OverallMetrics(mae_mw=0, rmse_mw=0, mape_pct=None, bias_mw=0, count=0),
                daily=[], hourly_comparison=[],
            )
            return response

        daily_groups: dict[str, list[HourlyComparisonPoint]] = defaultdict(list)
        for pt in hourly_points:
            daily_groups[pt.start_time[:10]].append(pt)

        daily_metrics = []
        for date_str, pts in sorted(daily_groups.items()):
            acts = [p.actual_generation_mw for p in pts]
            fcsts = [p.forecast_generation_mw for p in pts]
            daily_metrics.append(DailyMetrics(
                date=date_str,
                mae_mw=round(self._mae(acts, fcsts), 2),
                rmse_mw=round(self._rmse(acts, fcsts), 2),
                mape_pct=self._mape(acts, fcsts),
                bias_mw=round(sum(p.error_mw for p in pts) / len(pts), 2),
                count=len(pts),
            ))

        all_actual = [p.actual_generation_mw for p in hourly_points]
        all_forecast = [p.forecast_generation_mw for p in hourly_points]
        overall = OverallMetrics(
            mae_mw=round(self._mae(all_actual, all_forecast), 2),
            rmse_mw=round(self._rmse(all_actual, all_forecast), 2),
            mape_pct=self._mape(all_actual, all_forecast),
            bias_mw=round(sum(p.error_mw for p in hourly_points) / len(hourly_points), 2),
            count=len(hourly_points),
        )

        response = AccuracyResponse(overall=overall, daily=daily_metrics, hourly_comparison=hourly_points)
        cache.set(cache_key, response)
        return response

    def _mae(self, a: list[float], f: list[float]) -> float:
        return sum(abs(x - y) for x, y in zip(a, f)) / len(a) if a else 0.0

    def _rmse(self, a: list[float], f: list[float]) -> float:
        return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, f)) / len(a)) if a else 0.0

    def _mape(self, a: list[float], f: list[float]) -> float | None:
        if not a or any(x == 0 for x in a):
            return None
        return round(sum(abs((x - y) / x) for x, y in zip(a, f)) / len(a) * 100, 2)


accuracy_service = AccuracyService()