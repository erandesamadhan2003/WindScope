from pydantic import BaseModel
from datetime import datetime

class ActualPoint(BaseModel):
    start_time: datetime
    settlement_period: int
    generation_mw: float

class ActualsResponse(BaseModel):
    data: list[ActualPoint]
    total_records: int
    date_from: str
    date_to: str