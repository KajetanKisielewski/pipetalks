from typing import Optional
from datetime import datetime
from .helpers import BaseConfig
from .transcription_schemas import Transcription
from .user_schemas import UserWithImage


class Recording(BaseConfig):
    id: int
    filename: str
    duration: float
    url: str
    room_name: str
    user: UserWithImage
    created_at: Optional[datetime]
    transcription: Optional[Transcription]
