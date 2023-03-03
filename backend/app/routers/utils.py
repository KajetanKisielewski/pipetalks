from fastapi import APIRouter, status, Depends

from schemas import user_schemas, utils_schemas
from auth.jwt_helper import check_if_active_user
from settings import get_settings
from redis_client.redis_msg import get_redis_msg_client
from redis_client.redis_sid import get_redis_sid_client
from socket_events.socket_events import sio

app_settings = get_settings()
router = APIRouter(prefix=f"{app_settings.root_path}", tags=["Utils"])

redis_msg = get_redis_msg_client()
redis_sid = get_redis_sid_client()


@router.get(
    "/utils/new-messages",
    status_code=status.HTTP_200_OK
)
async def get_new_messages_count(
        current_user: user_schemas.User = Depends(check_if_active_user),
):
    """
    ## Get new messages count for logged-in user.
    User authentication required.
    """
    return redis_msg.get_all_msgs_count_for_user(current_user.email)


@router.post(
    "/utils/emit-notifications",
    include_in_schema=False
)
async def emit_notifications(
        request: utils_schemas.EmitNotifications
):
    if request.secret_key == app_settings.secret_key:
        await sio.emit("notification", data={"sender": request.sender, "channel": request.channel}, to=request.channel)
