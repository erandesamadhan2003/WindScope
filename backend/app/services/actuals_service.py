from datetime import datetime, timezone
from app.services.elexon_client import elexon_client
from app.schemas.actuals import ActualPoint, ActualsResponse
from app.core.cache import cache
import structlog

logger = structlog.get_logger()

class ActualsService:

    async def get_actuals(self, from_date: str, to_date: str) -> ActualsResponse:
        cache_key = f"actuals_{from_date}_{to_date}"
        cached = cache.get(cache_key)
        if cached:
            logger.info("cache_hit", key=cache_key)
            return cached

        raw = await elexon_client.fetch_actuals(from_date=from_date, to_date=to_date)

        points = []
        for record in raw:
            points.append(ActualPoint(
                start_time=datetime.fromisoformat(record["startTime"].replace("Z", "+00:00")),
                settlement_period=record.get("settlementPeriod", 0),
                generation_mw=float(record["generation"]),
            ))

        points.sort(key=lambda p: p.start_time)

        response = ActualsResponse(
            data=points,
            total_records=len(points),
            date_from=from_date,
            date_to=to_date,
        )
        cache.set(cache_key, response)
        return response


actuals_service = ActualsService()