from datetime import datetime
from collections import defaultdict
from app.services.elexon_client import elexon_client
from app.schemas.forecasts import LatestForecastPoint, ForecastsResponse
from app.core.cache import cache
from app.config import settings
import structlog

logger = structlog.get_logger()

class ForecastsService:

    async def get_latest_forecasts(self, from_date: str, to_date: str) -> ForecastsResponse:
        cache_key = f"forecasts_{from_date}_{to_date}"
        cached = cache.get(cache_key)
        if cached:
            logger.info("cache_hit", key=cache_key)
            return cached

        raw = await elexon_client.fetch_forecasts(from_date=from_date, to_date=to_date)

        forecasts_by_target: dict[datetime, list[tuple[datetime, float]]] = defaultdict(list)
        for record in raw:
            start_time = datetime.fromisoformat(record["startTime"].replace("Z", "+00:00"))
            publish_time = datetime.fromisoformat(record["publishTime"].replace("Z", "+00:00"))
            generation = float(record["generation"])
            forecasts_by_target[start_time].append((publish_time, generation))

        latest_points: list[LatestForecastPoint] = []
        for start_time, entries in forecasts_by_target.items():
            best_publish_time, best_generation = max(entries, key=lambda x: x[0])
            latest_points.append(LatestForecastPoint(
                start_time=start_time,
                forecast_generation_mw=best_generation,
                forecast_publish_time=best_publish_time,
            ))

        latest_points.sort(key=lambda p: p.start_time)

        response = ForecastsResponse(
            data=latest_points,
            total_records=len(latest_points),
            decision_cutoff_hour_utc=settings.DAY_AHEAD_CUTOFF_HOUR,
            description="Latest WINDFOR forecast per target period for the selected date range.",
        )
        cache.set(cache_key, response)
        return response


forecasts_service = ForecastsService()