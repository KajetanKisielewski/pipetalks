import os

from fastapi import APIRouter, status, Depends, UploadFile, Form, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from pydantic import parse_obj_as

from schemas import user_schemas
from models.user import User, UserSettings
from db.database import get_db
from exceptions.exceptions import UserNotFound
from auth.jwt_helper import get_current_user
from settings import get_settings
from utils.images_tasks import resize_image


app_settings = get_settings()
router = APIRouter(prefix=f"{app_settings.root_path}", tags=["Users"])


@router.get(
    "/users",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_user)]
)
async def read_all_users(
        db: Session = Depends(get_db),
        page: int = 1,
        page_size: int = 10
):
    users = User.get_all_users(db)
    first = (page - 1) * page_size
    last = first + page_size
    users_model = parse_obj_as(list[user_schemas.User], users)
    response = user_schemas.UserPagination(
        users_model,
        "/api/v1/users",
        first,
        last,
        page,
        page_size
    )
    return response


@router.get(
    "/me",
    response_model=user_schemas.UserDetail,
    status_code=status.HTTP_200_OK
)
async def read_user(
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(get_current_user),
):
    user = User.get_user_by_id(db, str(current_user.id))
    if not user:
        raise UserNotFound(str(current_user.id))
    return user


@router.put(
    "/me",
    response_model=user_schemas.UserDetail,
    status_code=status.HTTP_202_ACCEPTED
)
async def edit_user(
        request: user_schemas.UserEdit,
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(get_current_user),
):
    user_to_edit = User.get_user_by_id(db, str(current_user.id))
    if not user_to_edit:
        raise UserNotFound(str(current_user.id))
    if request.name:
        user_to_edit.name = request.name
    if request.password:
        user_to_edit.password = request.password
    db.commit()
    db.refresh(user_to_edit)
    return user_to_edit


@router.put(
    "/me/settings",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=user_schemas.UserDetail
)
async def edit_user_settings(
        background_tasks: BackgroundTasks,
        profile_image: UploadFile | None = None,
        language: str | None = Form(None),
        auto_translate: bool | None = Form(None),
        translate_language: str | None = Form(None),
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(get_current_user)
):
    user_to_edit = User.get_user_by_id(db, str(current_user.id))
    if not user_to_edit:
        raise UserNotFound(str(current_user.id))
    user_settings = user_to_edit.settings

    if profile_image:
        filename = f"{user_to_edit.email}" + profile_image.filename[-4:]
        with open(app_settings.profile_images_path + filename, "wb") as my_file:
            content = await profile_image.read()
            my_file.write(content)
            my_file.close()
        background_tasks.add_task(func=resize_image, image_path=f"{app_settings.profile_images_path}{filename}")
        user_settings.image_URL = app_settings.domain + app_settings.root_path + '/profile-image/' + filename

    languages = [n[0] for n in UserSettings.LANGUAGES]
    if language:
        if language in languages:
            user_settings.language = language
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Language not found."
            )
    if translate_language:
        if translate_language in languages:
            user_settings.translate_language = translate_language
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Language not found."
            )
    if auto_translate:
        user_settings.auto_translate = auto_translate

    db.commit()
    db.refresh(user_settings)
    return user_to_edit
