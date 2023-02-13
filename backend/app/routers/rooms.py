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

app_settings = get_settings()
router = APIRouter(prefix=f"{app_settings.root_path}", tags=["Rooms"])


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
    room = Room.get_room_by_name_for_user(db, room_name, current_user)
    if not room:
        raise RoomNotFound(room_name)
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
    room_to_delete = Room.get_room_by_name_for_user(db, room_name, current_user)
    if not room_to_delete:
        raise RoomNotFound

    for recording in room_to_delete.recordings:
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
    room_to_edit = Room.get_room_by_name(db, room_name)
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
    return {"info": f"Room '{room_name}' edited."}
