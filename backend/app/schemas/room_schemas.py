from typing import Optional
from datetime import datetime
from pydantic import EmailStr, validator
from .helpers import BaseConfig, CustomPagination
from .recording_schemas import Recording
from .user_schemas import User


class Room(BaseConfig):
    name: str
    is_public: bool
    created_at: Optional[datetime]
    users: Optional[list[User]] = []


class RoomDetail(Room):
    recordings: Optional[list[Recording]] = []


class RoomPagination(CustomPagination):
    records: list[Room] = []


class RoomCreate(BaseConfig):
    name: str
    is_public: Optional[bool]

    @validator('name')
    def validate_room_name(cls, v):
        if not len(v) > 2:
            raise ValueError("Name has to be at least 3 characters long.")
        return v


class RoomUsers(BaseConfig):
    user_emails: Optional[list[EmailStr]] = []
