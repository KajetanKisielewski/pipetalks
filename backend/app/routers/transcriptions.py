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
    "/transcriptions/file/{filename}",
    status_code=status.HTTP_200_OK,
    response_model=transcription_schemas.TranscriptionText
)
async def get_transcription_file(
        filename: str,
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user),
):
    transcription = Transcription.get_transcription_by_filename_for_user(db, filename, current_user)
    file_path = \
        f"{app_settings.rooms_path}{transcription.recording.room_name}/{app_settings.transcriptions_path}{filename}"
    if transcription and os.path.exists(file_path):
        with open(file_path, "r") as file:
            file_text = file.read()
        return {"text": file_text}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="File not found."
    )


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
    transcription = Transcription.get_transcription_by_id_for_user(db, transcription_id, current_user)
    if not transcription:
        raise TranscriptionNotFound(transcription_id)
    return transcription


@router.get(
    "/transcriptions/{transcription_id}/translation",
    status_code=status.HTTP_200_OK,
    response_model=transcription_schemas.TranscriptionText
)
async def get_transcription_translation(
        transcription_id: int,
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user),
):
    transcription = Transcription.get_transcription_by_id_for_user(db, transcription_id, current_user)
    if not transcription:
        raise TranscriptionNotFound(transcription_id)
    file_path = f"{app_settings.rooms_path}{transcription.recording.room_name}/" \
                f"{app_settings.transcriptions_path}{transcription.filename}"
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            file_text = file.read()
        user = User.get_user_by_email(db, current_user.email)
        return {"text": translate_text(user.settings.translate_language.code, file_text)}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="File not found."
    )
