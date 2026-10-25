
from pydantic_settings import BaseSettings, SettingsConfigDict
from datetime import date, timedelta


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "Wind Energy Procurement Dashboard API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    ALLOWED_ORIGINS_STR: str = (
        "http://localhost:3000,"
        "http://localhost:5173,"
        "https://windscope-frontend.vercel.app,"
        "https://windscope-frontend-lwcz91m3k-erandesamadhan2003-9607s-projects.vercel.app"
    )

    ELEXON_BASE_URL: str = "https://data.elexon.co.uk/bmrs/api/v1"
    DAY_AHEAD_CUTOFF_HOUR: int = 12
    CACHE_TTL_SECONDS: int = 3600

    @property
    def ALLOWED_ORIGINS(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.ALLOWED_ORIGINS_STR.split(",")
            if origin.strip()
        ]

    @property
    def DATA_FROM(self) -> str:
        return (date.today() - timedelta(days=1)).isoformat()

    @property
    def DATA_TO(self) -> str:
        return (date.today() + timedelta(days=2)).isoformat()


settings = Settings()
