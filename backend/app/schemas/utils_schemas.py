from .helpers import BaseConfig


class EmitNotifications(BaseConfig):
    secret_key: str
    users: list = []
    channel: str
