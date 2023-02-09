from typing import Optional
from datetime import datetime
from .helpers import BaseConfig, CustomPagination
from .recording_schemas import Recording
from .user_schemas import User


class Room(BaseConfig):
    name: str
    created_at: Optional[datetime]
    users: Optional[list[User]] = []


class RoomDetail(Room):
    recordings: Optional[list[Recording]] = []


class RoomCreate(BaseConfig):
    name: str


class RoomPagination(CustomPagination):
    records: list[Room] = []
