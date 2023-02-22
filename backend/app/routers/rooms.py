import os

from fastapi import APIRouter, status, Depends, Response
from db.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import parse_obj_as

from models.room import Room
from models.user import User
from schemas import room_schemas, user_schemas
from auth.jwt_helper import check_if_active_user, check_if_superuser
from settings import get_settings
from exceptions.exceptions import RoomNotFound, WrongRoomName, UserNotFound
from socket_events.socket_events import sio, users_sid
from pika_client.pika_client import get_pika_client

app_settings = get_settings()
router = APIRouter(prefix=f"{app_settings.root_path}", tags=["Rooms"])

rabbit_client = get_pika_client()


@router.get(
    "/rooms/{room_name}",
    status_code=status.HTTP_200_OK,
    response_model=room_schemas.RoomDetail
)
async def get_room_info(
        room_name: str,
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user),
):
    """
    ## Get detail info about one room that current user already joined.
    Path parameters:
    - **room_name** - string

    Clears user's dedicated rabbitmq queue with unread messages count for this room.
    User authentication required.
    """
    room = Room.get_room_by_name_for_user(db, room_name, current_user)
    if not room:
        raise RoomNotFound(room_name)
    if not rabbit_client.connection or rabbit_client.connection.is_closed:
        rabbit_client.setup()
    rabbit_client.clear_queue(user_email=current_user.email, room=room_name)
    return room


@router.get(
    "/rooms",
    status_code=status.HTTP_200_OK
)
async def get_all_user_joined_rooms(
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user),
        page: int = 1,
        page_size: int = 10,
        all_rooms: bool | None = None
):
    """
    ## Get info about all rooms.
    Query parameters:
    - **page** - integer, default = 1
    - **page_size** - integer, default = 10
    - **all_rooms** - boolean, optional, default = None - if set to true, endpoint will return all user joined rooms \
    + all not joined public rooms

    User authentication required.
    """
    rooms = Room.get_all_rooms_for_user(db, current_user)
    if all_rooms:
        rooms = list(set(rooms + Room.get_all_public_rooms(db)))
    first = (page - 1) * page_size
    last = first + page_size
    rooms_model = parse_obj_as(list[room_schemas.Room], rooms)
    response = room_schemas.RoomPagination(
        rooms_model,
        f"/api/v1/rooms?all={all_rooms}",
        first,
        last,
        page,
        page_size
    )
    return response


@router.post(
    "/rooms",
    status_code=status.HTTP_201_CREATED
)
async def create_room(
        request: room_schemas.RoomCreate,
        current_user: user_schemas.User = Depends(check_if_active_user),
        db: Session = Depends(get_db)
):
    """
    ## Create new room.
    Body:
    - **name** - string, unique, required
    - **is_public** - boolean, optional, default = True

    User authentication required.
    """
    user = User.get_user_by_email(db, current_user.email)
    try:
        is_public = True if request.is_public in [True, None] else False
        room = Room(
            name=request.name,
            users=[user],
            is_public=is_public
        )
        db.add(room)
        db.commit()
        db.refresh(room)
        if users_sid.get(user.email):
            [sio.enter_room(i, room.name) for i in users_sid.get(user.email)]
    except IntegrityError:
        raise WrongRoomName(request.name)
    if not os.path.exists(f"{app_settings.rooms_path}{request.name}/"):
        os.mkdir(f"{app_settings.rooms_path}{request.name}/")
    if not os.path.exists(f"{app_settings.rooms_path}{request.name}/{app_settings.recordings_path}"):
        os.mkdir(f"{app_settings.rooms_path}{request.name}/{app_settings.recordings_path}")
    if not os.path.exists(f"{app_settings.rooms_path}{request.name}/{app_settings.transcriptions_path}"):
        os.mkdir(f"{app_settings.rooms_path}{request.name}/{app_settings.transcriptions_path}")
    return {"info": f"Room created."}


@router.delete(
    "/rooms/{room_name}"
)
async def delete_room(
        room_name: str,
        current_user: user_schemas.User = Depends(check_if_superuser),
        db: Session = Depends(get_db)
):
    """
    ## Delete room.
    Path parameters:
    - **room_name** - string

    Admin authentication required.
    """
    room_to_delete = Room.get_room_by_name_for_user(db, room_name, current_user)
    if not room_to_delete:
        raise RoomNotFound(room_name)

    for recording in room_to_delete.recordings:
        if recording.transcription:
            transcription_file_path = f"{app_settings.rooms_path}{room_to_delete.name}/" \
                    f"{app_settings.transcriptions_path}{recording.transcription.filename}"
            try:
                os.remove(transcription_file_path)
            except Exception as e:
                print({"Error": e})
        file_path = f"{app_settings.rooms_path}{room_to_delete.name}/" \
                    f"{app_settings.recordings_path}{recording.filename}"
        try:
            os.remove(file_path)
        except Exception as e:
            print({"Error": e})

    db.delete(room_to_delete)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put(
    "/rooms/{room_name}",
    status_code=status.HTTP_202_ACCEPTED
)
async def edit_room_users(
        room_name: str,
        request: room_schemas.RoomUsers,
        current_user: user_schemas.User = Depends(check_if_active_user),
        db: Session = Depends(get_db)
):
    """
    ## Join new room or add new members to one that you already joined.
    Path parameters:
    - **room_name** - string

    Body:
    - **user_emails** - list of strings, optional - include if you want to add someone to the room \
    or skip it and use this endpoint only to add current user to the room

    User authentication required.
    """
    room_to_edit = Room.get_room_by_name(db, room_name)
    if not room_to_edit:
        raise RoomNotFound(room_name)
    user = User.get_user_by_email(db, current_user.email)

    if room_to_edit.is_public or (not room_to_edit.is_public and user in room_to_edit.users):
        if user not in room_to_edit.users:
            room_to_edit.users.append(user)
        for email in request.user_emails:
            user = User.get_user_by_email(db, email)
            if not user:
                raise UserNotFound(email)
            room_to_edit.users.append(user)
    else:
        raise RoomNotFound(room_name)
    db.commit()
    db.refresh(room_to_edit)

    for email in request.user_emails:
        if users_sid.get(email):
            [sio.enter_room(i, room_to_edit.name) for i in users_sid.get(email)]
    if users_sid.get(user.email):
        [sio.enter_room(i, room_to_edit.name) for i in users_sid.get(user.email)]

    return {"info": f"Room '{room_name}' edited."}


@router.put(
    "/rooms/{room_name}/leave",
    status_code=status.HTTP_202_ACCEPTED
)
async def leave_room(
        room_name: str,
        current_user: user_schemas.User = Depends(check_if_active_user),
        db: Session = Depends(get_db)
):
    """
    ## Leave room without deleting it.
    Path parameters:
    - **room_name** - string

    User authentication required.
    """
    user = User.get_user_by_email(db, current_user.email)
    room_to_edit = Room.get_room_by_name(db, room_name)
    if not room_to_edit or user not in room_to_edit.users:
        raise RoomNotFound(room_name)

    room_to_edit.users.remove(user)
    db.commit()
    db.refresh(room_to_edit)

    if users_sid.get(user.email):
        [sio.leave_room(i, room_to_edit.name) for i in users_sid.get(user.email)]

    return {"info": f"Successfully left room '{room_name}'"}
