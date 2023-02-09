from typing import Optional
from datetime import datetime
from pydantic import EmailStr
from .helpers import BaseConfig
from .transcription_schemas import Transcription


class Recording(BaseConfig):
    id: int
    filename: str
    duration: float
    url: str
    room_name: str
    user_email: EmailStr
    created_at: Optional[datetime]
    transcription: Optional[Transcription]
