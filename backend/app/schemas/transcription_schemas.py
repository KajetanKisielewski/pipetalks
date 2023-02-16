from typing import Optional
from datetime import datetime
from .helpers import BaseConfig


class Transcription(BaseConfig):
    id: int
    filename: str
    url: str
    language: str
    created_at: Optional[datetime]


class TranscriptionText(BaseConfig):
    text: str
