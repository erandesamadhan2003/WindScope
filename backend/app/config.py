from pydantic_settings import BaseSettings, SettingsConfigDict
from datetime import date, timedelta


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    APP_NAME: str = "Wind Energy Procurement Dashboard API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    ALLOWED_ORIGINS_STR: str = "http://localhost:3000,http://localhost:5173"

    ELEXON_BASE_URL: str = "https://data.elexon.co.uk/bmrs/api/v1"

    # Day-ahead market decision cutoff hour (UTC)
    DAY_AHEAD_CUTOFF_HOUR: int = 12

    # Cache TTL in seconds
    CACHE_TTL_SECONDS: int = 3600

    @property
    def ALLOWED_ORIGINS(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS_STR.split(",") if o.strip()]

    @property
    def DATA_FROM(self) -> str:
        # Yesterday — gives us past actuals to compare against forecasts
        return (date.today() - timedelta(days=1)).isoformat()

    @property
    def DATA_TO(self) -> str:
        # Day after tomorrow — captures full forecast horizon
        return (date.today() + timedelta(days=2)).isoformat()


settings = Settings()