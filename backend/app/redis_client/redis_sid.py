import redis
from functools import lru_cache

from settings import get_settings

app_settings = get_settings()


class RedisForSid:
    """
    Class used to store, write and read user's socket ids into redis database.
    """
    def __init__(self, host, port, password):
        self.client = redis.Redis(
            host=host,
            port=port,
            db=0,
            password=password
        )

    def clear_db(self):
        self.client.flushdb(asynchronous=False)

    def get_all_users(self):
        return self.client.keys(pattern="*")

    def add_user_sid(self, user_email, sid):
        self.client.rpush(user_email, sid)

    def remove_user_sid(self, user_email, sid):
        self.client.lrem(user_email, count=0, value=sid)

    def get_user_sids(self, user_email):
        return self.client.lrange(user_email, 0, -1)

    def get_user_sids_count(self, user_email):
        return self.client.llen(user_email)


@lru_cache
def get_redis_sid_client():
    return RedisForSid(
        host=app_settings.redis_host,
        port=app_settings.redis_port,
        password=app_settings.redis_password
    )
