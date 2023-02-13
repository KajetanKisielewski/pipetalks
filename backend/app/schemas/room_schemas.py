from typing import Optional
from datetime import datetime
from pydantic import EmailStr
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


class RoomCreate(BaseConfig):
    name: str
    is_public: Optional[bool]


class RoomPagination(CustomPagination):
    records: list[Room] = []


class RoomUsers(BaseConfig):
    user_emails: Optional[list[EmailStr]] = []
