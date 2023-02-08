from typing import Optional
from datetime import datetime
from .helpers import BaseConfig, CustomPagination


class Transcription(BaseConfig):
    id: int
    filename: str
    url: str
    created_at: Optional[datetime]


class TranscriptionText(BaseConfig):
    text: str
