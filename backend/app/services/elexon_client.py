import httpx
import structlog
from app.config import settings
from app.core.exceptions import ElexonAPIError

logger = structlog.get_logger()

class ElexonClient:
    """
    Async HTTP client for the Elexon BMRS API.
    Uses httpx with timeouts and retries.
    """

    BASE_URL = settings.ELEXON_BASE_URL
    TIMEOUT = httpx.Timeout(30.0, connect=10.0)

    async def _get(self, endpoint: str, params: dict) -> list[dict]:
        url = f"{self.BASE_URL}/{endpoint}"
        logger.info("elexon_request", url=url, params=params)

        try:
            async with httpx.AsyncClient(timeout=self.TIMEOUT) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                logger.info("elexon_response", url=url, records=len(data))
                return data

        except httpx.HTTPStatusError as e:
            raise ElexonAPIError(
                f"Elexon API returned {e.response.status_code} for {url}",
                status_code=502,
            )
        except httpx.RequestError as e:
            raise ElexonAPIError(
                f"Could not reach Elexon API: {str(e)}",
                status_code=503,
            )

    async def fetch_actuals(self, from_date: str, to_date: str) -> list[dict]:
        return await self._get(
            "datasets/FUELHH/stream",
            params={"from": from_date, "to": to_date, "fuelType": "WIND"},
        )

    async def fetch_forecasts(self, from_date: str, to_date: str) -> list[dict]:
        return await self._get(
            "datasets/WINDFOR/stream",
            params={"from": from_date, "to": to_date},
        )


# Singleton
elexon_client = ElexonClient()