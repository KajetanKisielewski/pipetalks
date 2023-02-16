from typing import Optional
from datetime import datetime
from pydantic import EmailStr
from .helpers import BaseConfig, CustomPagination
from .recording_schemas import Recording
from .user_schemas import User


class DirectChannel(BaseConfig):
    id: int
    created_at: Optional[datetime]
    users: Optional[list[User]] = []


class DirectChannelDetail(DirectChannel):
    recordings: Optional[list[Recording]] = []


class DirectChannelPagination(CustomPagination):
    records: list[DirectChannel] = []


class DirectChannelCreate(BaseConfig):
    user_email: EmailStr
