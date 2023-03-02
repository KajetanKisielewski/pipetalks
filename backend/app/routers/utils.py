from fastapi import APIRouter, status, Depends

from schemas import user_schemas
from auth.jwt_helper import check_if_active_user
from settings import get_settings
from redis_client.redis_msg import get_redis_msg_client

app_settings = get_settings()
router = APIRouter(prefix=f"{app_settings.root_path}", tags=["Utils"])

redis_msg = get_redis_msg_client()


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
