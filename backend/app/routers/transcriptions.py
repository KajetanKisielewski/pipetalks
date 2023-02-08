import os
from fastapi import APIRouter, status, Depends, HTTPException
from db.database import get_db
from sqlalchemy.orm import Session

from models.transcription import Transcription
from schemas import transcription_schemas, user_schemas
from auth.jwt_helper import get_current_user
from exceptions.exceptions import TranscriptionNotFound
from settings import get_settings

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
        current_user: user_schemas.User = Depends(get_current_user),
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
        current_user: user_schemas.User = Depends(get_current_user),
):
    transcription = Transcription.get_transcription_by_id_for_user(db, transcription_id, current_user)
    if not transcription:
        raise TranscriptionNotFound(transcription_id)
    return transcription
