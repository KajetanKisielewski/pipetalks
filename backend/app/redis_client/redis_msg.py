import redis
from functools import lru_cache

from settings import get_settings

app_settings = get_settings()


class RedisForMsg:
    """
    Class used to store, write and read user's unread messages count into redis database.
    """
    def __init__(self, host, port, password):
        self.client = redis.Redis(
            host=host,
            port=port,
            db=2,
            password=password
        )

    def clear_db(self):
        self.client.flushdb(asynchronous=False)

    def increment_room_msg_count_for_user(self, user_email, room_name):
        self.client.hincrby(name=user_email, key=room_name, amount=1)

    def reset_room_msg_count_for_user(self, user_email, room_name):
        self.client.hdel(user_email, room_name)

    def get_room_msg_count_for_user(self, user_email, room_name):
        return self.client.hget(name=user_email, key=room_name)

    def get_all_msgs_count_for_user(self, user_email):
        count = self.client.hgetall(name=user_email)
        msg_dict = {}
        for k, v in count.items():
            msg_dict[k.decode("utf-8")] = int(v.decode("utf-8"))
        return msg_dict


@lru_cache
def get_redis_msg_client():
    return RedisForMsg(
        host=app_settings.redis_host,
        port=app_settings.redis_port,
        password=app_settings.redis_password
    )
