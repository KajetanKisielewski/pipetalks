from .helpers import BaseConfig


class EmitNotifications(BaseConfig):
    secret_key: str
    sender: str
    channel: str
