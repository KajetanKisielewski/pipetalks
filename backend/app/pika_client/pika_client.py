import pika
import json
from functools import lru_cache

from settings import get_settings

app_settings = get_settings()


class PikaClient:
    """
    Class creates a rabbitmq client that stores info about unread messages for users.
    :param: host: rabbitmq instance host
    """
    def __init__(self, host):
        self.host = host
        self.connection = None
        self.channel = None
        self.queue_name = None
        self.message = None
        self.msg_dict = {}

    def setup(self) -> None:
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=self.host, heartbeat=0)
        )
        self.channel = self.connection.channel()

    def publish_msg(self, message: dict) -> None:
        self.message = message
        self.queue_name = (
            f"{self.message.get('receiver')}:{self.message.get('room')}"
        )
        self.channel.queue_declare(queue=self.queue_name, durable=True)
        self.channel.basic_publish(
            exchange="", routing_key=self.queue_name, body=json.dumps(self.message)
        )

    def receive_all_msgs(self, user_email: str, rooms: list) -> dict:
        if not self.msg_dict.get(user_email):
            self.msg_dict[user_email] = {}
        for room in rooms:
            self.queue_name = f"{user_email}:{room}"
            self.channel.queue_declare(queue=self.queue_name, durable=True)
            if not self.msg_dict.get(user_email).get(room):
                self.msg_dict[user_email][room] = 0
            while True:
                method_frame, header_frame, body = self.channel.basic_get(self.queue_name)
                if method_frame:
                    self.msg_dict[user_email][room] += 1
                    self.channel.basic_ack(method_frame.delivery_tag)
                else:
                    break
        return self.msg_dict.get(user_email)

    def clear_queue(self, user_email, room) -> None:
        self.queue_name = f"{user_email}:{room}"
        self.channel.queue_declare(queue=self.queue_name, durable=True)
        self.channel.queue_purge(queue=self.queue_name)
        if not self.msg_dict.get(user_email):
            self.msg_dict[user_email] = {}
        self.msg_dict[user_email][room] = 0

    def close(self) -> None:
        self.channel.close()
        self.connection.close()


@lru_cache
def get_pika_client():
    return PikaClient(host=app_settings.amqp_host)
