import os

from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import Response
from db.database import get_db
from sqlalchemy.orm import Session
from pydantic import parse_obj_as

from models.direct_channel import DirectChannel
from models.user import User
from schemas import direct_channels_schemas, user_schemas
from auth.jwt_helper import check_if_active_user
from settings import get_settings
from exceptions.exceptions import UserNotFound
from socket_events.socket_events import sio, users_sid

app_settings = get_settings()
router = APIRouter(prefix=f"{app_settings.root_path}", tags=["Direct Channels"])


@router.get(
    "/direct-channels",
    status_code=status.HTTP_200_OK
)
async def get_all_direct_channels_for_user(
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user),
        page: int = 1,
        page_size: int = 10
):
    """
    ## Get info about all current user's direct channels.
    Query parameters:
    - **page** - integer, default = 1
    - **page_size** - integer, default = 10

    User authentication required.
    """
    direct_channels = DirectChannel.get_all_direct_channels_for_user(db, current_user)
    first = (page - 1) * page_size
    last = first + page_size
    rooms_model = parse_obj_as(list[direct_channels_schemas.DirectChannel], direct_channels)
    response = direct_channels_schemas.DirectChannelPagination(
        rooms_model,
        f"/api/v1/direct-channels",
        first,
        last,
        page,
        page_size
    )
    return response


@router.get(
    "/direct-channels/{user_email}",
    status_code=status.HTTP_200_OK,
    response_model=direct_channels_schemas.DirectChannelDetail
)
async def get_direct_channel_info(
        user_email: str,
        response: Response,
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user)
):
    """
    ## Get detail info about one user's direct channel.
    Path parameters:
    - **user_email** - string - email of second participant of direct channel

    Important - if direct channel with chosen user_email doesn't exist yet, it will be automatically created.

    User authentication required.
    """
    second_user = User.get_user_by_email(db, user_email)
    if not second_user:
        raise UserNotFound(user_email)
    direct_channel = DirectChannel.get_direct_channels_for_two_users(db, current_user, second_user)
    if not direct_channel:
        request = direct_channels_schemas.DirectChannelCreate(user_email=user_email)
        direct_channel = await create_direct_channel(request, current_user, db)
        response.status_code = status.HTTP_201_CREATED

        sids1 = users_sid.get(current_user.email)
        sids2 = users_sid.get(second_user.email)
        sids = (sids1 if sids1 else []) + (sids2 if sids2 else [])
        for sid in sids:
            sio.enter_room(sid, direct_channel.id)

    return direct_channel


@router.post(
    "/direct-channels",
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False
)
async def create_direct_channel(
        request: direct_channels_schemas.DirectChannelCreate,
        current_user: user_schemas.User = Depends(check_if_active_user),
        db: Session = Depends(get_db)
):
    """
    ## Create new direct channel.
    Body:
    - **user_email** - string, required - email of second user to participate in direct channel

    User authentication required.
    """
    user = User.get_user_by_email(db, current_user.email)
    second_user = User.get_user_by_email(db, request.user_email)
    if DirectChannel.get_direct_channels_for_two_users(db, user, second_user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Direct channel for two given users already exists."
        )
    if not second_user:
        raise UserNotFound(request.user_email)
    direct_channel = DirectChannel(
        users=[user, second_user]
    )
    db.add(direct_channel)
    db.commit()
    db.refresh(direct_channel)
    direct_channel = DirectChannel.get_direct_channels_for_two_users(db, current_user, second_user)
    if not os.path.exists(f"{app_settings.direct_channels_path}{direct_channel.id}/"):
        os.mkdir(f"{app_settings.direct_channels_path}{direct_channel.id}/")
    if not os.path.exists(f"{app_settings.direct_channels_path}{direct_channel.id}/{app_settings.recordings_path}"):
        os.mkdir(f"{app_settings.direct_channels_path}{direct_channel.id}/{app_settings.recordings_path}")
    if not os.path.exists(f"{app_settings.direct_channels_path}{direct_channel.id}/{app_settings.transcriptions_path}"):
        os.mkdir(f"{app_settings.direct_channels_path}{direct_channel.id}/{app_settings.transcriptions_path}")
    return direct_channel
