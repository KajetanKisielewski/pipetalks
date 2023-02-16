import os
from fastapi import APIRouter, status, Depends, HTTPException
from db.database import get_db
from sqlalchemy.orm import Session

from models.transcription import Transcription
from models.user import User
from schemas import transcription_schemas, user_schemas
from auth.jwt_helper import check_if_active_user
from exceptions.exceptions import TranscriptionNotFound
from settings import get_settings
from utils.cloud_translate import translate_text

app_settings = get_settings()
router = APIRouter(prefix=f"{app_settings.root_path}", tags=["Transcriptions"])


@router.get(
    "/transcriptions/{transcription_id}",
    status_code=status.HTTP_200_OK,
    response_model=transcription_schemas.Transcription
)
async def get_transcription_info(
        transcription_id: int,
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user),
):
    """
    ## Get info about one transcription.
    Path parameters:
    - **transcription_id** - integer

    User authentication required.
    """
    transcription = Transcription.get_transcription_by_id_for_user(db, transcription_id, current_user)
    if not transcription:
        raise TranscriptionNotFound()
    return transcription


@router.get(
    "/transcriptions/file/{filename}",
    status_code=status.HTTP_200_OK,
    response_model=transcription_schemas.TranscriptionText
)
async def get_transcription_file(
        filename: str,
        translation: bool | None = None,
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user),
):
    """
    ## Get transcription text.
    Path parameters:
    - **filename** - string

    Query parameters:
    - **translation** - boolean, optional - if set to true transcription will be translated to \
    user's translation_language

    User authentication required.
    """
    transcription = Transcription.get_transcription_by_filename_for_user(db, filename, current_user)
    if not transcription:
        raise TranscriptionNotFound()

    if transcription.recording.room_name:
        file_path = f"{app_settings.rooms_path}{transcription.recording.room_name}/" \
                    f"{app_settings.transcriptions_path}{transcription.filename}"
    else:
        file_path = f"{app_settings.direct_channels_path}{transcription.recording.direct_channel_id}/" \
                    f"{app_settings.transcriptions_path}{transcription.filename}"

    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            file_text = file.read()
        if translation:
            user = User.get_user_by_email(db, current_user.email)
            languages = {
                'pl-PL': 'pl',
                'en-US': 'en',
                'de-DE': 'de',
                'fr-FR': 'fr',
                'es-ES': 'es',
            }
            file_text = translate_text(languages[user.settings.translate_language.code], file_text)
        return {"text": file_text}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="File not found."
    )
