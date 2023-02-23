from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from schemas import user_schemas
from db.database import get_db
from models.room import Room
from models.direct_channel import DirectChannel
from auth.jwt_helper import check_if_active_user
from settings import get_settings
from pika_client.pika_client import get_pika_client

app_settings = get_settings()
router = APIRouter(prefix=f"{app_settings.root_path}", tags=["Utils"])

rabbit_client = get_pika_client()


@router.get(
    "/utils/new-messages",
    status_code=status.HTTP_200_OK
)
async def get_new_messages_count(
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user),
):
    """
    ## Get new messages count for logged-in user.
    User authentication required.
    """
    rooms = Room.get_all_rooms_for_user(db, current_user)
    direct_channels = DirectChannel.get_all_direct_channels_for_user(db, current_user)
    rooms_list = [room.name for room in rooms] + [str(direct_channel.id) for direct_channel in direct_channels]
    if not rabbit_client.connection or rabbit_client.connection.is_closed:
        rabbit_client.setup()
    msg_dict = rabbit_client.receive_all_msgs(current_user.email, rooms_list)
    return msg_dict
