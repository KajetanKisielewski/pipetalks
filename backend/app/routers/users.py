from fastapi import APIRouter, status, Depends, UploadFile, Form, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from pydantic import parse_obj_as

from schemas import user_schemas
from models.user import User, UserSettings
from db.database import get_db
from exceptions.exceptions import UserNotFound
from auth.jwt_helper import check_if_active_user, check_if_superuser
from settings import get_settings
from utils.images_tasks import resize_image


app_settings = get_settings()
router = APIRouter(prefix=f"{app_settings.root_path}", tags=["Users"])


@router.get(
    "/users",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(check_if_active_user)]
)
async def read_all_users(
        db: Session = Depends(get_db),
        page: int = 1,
        page_size: int = 10
):
    """
    ## Get list of all users.
    Query parameters:
    - **page** - integer, default = 1
    - **page_size** - integer, default = 10

    User authentication required.
    """
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


@router.put(
    "/users/{user_id}",
    response_model=user_schemas.UserDetail,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(check_if_superuser)]
)
async def edit_user_status(
        user_id: str,
        request: user_schemas.UserStatus,
        db: Session = Depends(get_db),
):
    """
    ## Edit user is_admin and / or is_active status.
    Path parameters:
    - **user_id** - string, uuid format
    Body:
    - **is_admin** - boolean, optional
    - **is_active** - boolean, optional

    Admin authentication required.
    """
    user = User.get_user_by_id(db, str(user_id))
    if not user:
        raise UserNotFound(str(user_id))
    if request.is_admin in [False, True]:
        user.is_admin = request.is_admin
    if request.is_active in [False, True]:
        user.is_active = request.is_active
    db.commit()
    db.refresh(user)
    return user


@router.get(
    "/me",
    response_model=user_schemas.UserDetail,
    status_code=status.HTTP_200_OK
)
async def read_user(
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user),
):
    """
    ## Get info about current user.
    User authentication required.
    """
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
        current_user: user_schemas.User = Depends(check_if_active_user),
):
    """
    ## Edit current user.
    Body:
    - **name** - string, optional
    - **password** - string, optional

    User authentication required.
    """
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
        current_user: user_schemas.User = Depends(check_if_active_user)
):
    """
    ## Edit current user settings.
    FormData:
    - **profile_image** - bytes, optional
    - **language** - string, optional, only available from ["pl-PL", "en-US", "de-DE", "fr-FR", "es-ES"]
    - **auto_translate** - bool, optional
    - **translation_language** - string, optional, only available from ["pl-PL", "en-US", "de-DE", "fr-FR", "es-ES"]

    User authentication required.
    """
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
