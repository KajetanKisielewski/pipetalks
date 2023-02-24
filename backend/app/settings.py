from functools import lru_cache
from pydantic import BaseSettings


class Settings(BaseSettings):
    postgres_user: str
    postgres_db: str
    postgres_password: str
    postgres_host: str
    postgres_port: str

    celery_broker_url: str
    celery_result_backend: str
    amqp_host: str
    amqp_uri: str

    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    mail_username: str
    mail_password: str
    mail_from: str
    mail_port: int
    mail_server: str
    mail_tls: bool
    mail_ssl: bool
    use_credentials: bool
    validate_certs: bool

    root_path: str
    domain: str
    recordings_path: str
    rooms_path: str
    direct_channels_path: str
    transcriptions_path: str
    profile_images_path: str

    storage_credentials_file: str
    bucket_name: str

    redis_host: str
    redis_port: int
    redis_password: str

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'


@lru_cache
def get_settings():
    return Settings()
