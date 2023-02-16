import re
from datetime import datetime
from typing import Optional, Any
from pydantic import EmailStr, validator, root_validator
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

    @root_validator(pre=True)
    def verify_password_match(cls, values):
        new_password = values.get("new_password")
        confirm_password = values.get("confirm_password")
        if new_password != confirm_password:
            raise ValueError("Two given passwords do not match.")
        return values

    @validator('new_password')
    def validate_password(cls, v):
        pattern = re.compile(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")
        if not pattern.match(v):
            raise ValueError(
                "Password have to be at least 8 characters long and contain at least 1 letter and 1 number."
            )
        return Hash.get_password_hash(v)


class UserWithoutId(BaseConfig):
    name: str
    email: EmailStr
    settings: UserImage


class User(UserWithoutId):
    id: UUID


class UserDetail(User):
    is_active: bool
    is_admin: bool
    updated_at: Optional[datetime]
    created_at: Optional[datetime]
    settings: UserSettings


class UserEdit(BaseConfig):
    name: Optional[str]
    password: Optional[str]

    @validator('password')
    def validate_password(cls, v):
        pattern = re.compile(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")
        if not pattern.match(v):
            raise ValueError(
                "Password has to be at least 8 characters long and contain at least 1 letter and 1 number."
            )
        return Hash.get_password_hash(v)

    @validator('name')
    def validate_username(cls, v):
        if not len(v) > 2:
            raise ValueError("Name has to be at least 3 characters long.")
        return v


class UserCreate(UserEdit):
    email: EmailStr
    name: str
    password: str


class UserPagination(CustomPagination):
    records: list[User] = []


class UserStatus(BaseConfig):
    is_admin: Optional[bool]
    is_active: Optional[bool]
