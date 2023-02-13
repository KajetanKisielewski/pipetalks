from datetime import datetime
from typing import Optional, Any
from pydantic import EmailStr
from uuid import UUID

from auth.hash import Hash
from .helpers import CustomPagination, BaseConfig


class UserSettings(BaseConfig):
    image_URL: Optional[str]
    language: Any
    auto_translate: bool
    translate_language: Any


class UserImage(BaseConfig):
    image_URL: Optional[str]


class ForgotPassword(BaseConfig):
    email: EmailStr


class ResetPassword(BaseConfig):
    reset_password_token: str
    new_password: str
    confirm_password: str


class User(BaseConfig):
    id: UUID
    name: str
    email: EmailStr


class UserWithImage(BaseConfig):
    name: str
    email: EmailStr
    settings: UserImage


class UserDetail(User):
    is_active: bool
    is_admin: bool
    updated_at: Optional[datetime]
    created_at: Optional[datetime]
    settings: UserSettings


class UserEdit(BaseConfig):
    name: Optional[str]
    password: Optional[str]

    def __init__(self, **data: Any):
        super().__init__(**data)
        self.password = Hash.get_password_hash(self.password)


class UserCreate(BaseConfig):
    email: EmailStr
    name: str
    password: str

    def __init__(self, **data: Any):
        super().__init__(**data)
        self.password = Hash.get_password_hash(self.password)


class UserPagination(CustomPagination):
    records: list[User] = []


class UserStatus(BaseConfig):
    is_admin: Optional[bool]
    is_active: Optional[bool]
