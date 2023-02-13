from fastapi import APIRouter, status, Depends, UploadFile, HTTPException, Response, File, Form, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import os
import shutil
from librosa import get_duration
from datetime import datetime
from secrets import token_urlsafe
from pydub import AudioSegment

from db.database import get_db
from models.recording import Recording
from models.room import Room
from utils.audio_files_tasks import convert_to_wav_and_save_file, convert_and_save_file, delete_audio_file
from schemas import recording_schemas, user_schemas
from auth.jwt_helper import check_if_active_user
from settings import get_settings
from exceptions.exceptions import RecordingNotFound, RoomNotFound
from celery_worker.tasks import transcript

app_settings = get_settings()
router = APIRouter(prefix=f"{app_settings.root_path}", tags=["Recordings"])


@router.post(
    "/recordings",
    status_code=status.HTTP_200_OK
)
async def upload_recorded_audio_bytes(
        file: bytes = File(),
        browser: str = Form(),
        room_name: str = Form(),
        current_user: user_schemas.User = Depends(check_if_active_user),
        db: Session = Depends(get_db)
):
    room = Room.get_room_by_name_for_user(db, room_name, current_user)
    if not room:
        raise RoomNotFound(room_name)
    number = len(room.recordings)

    new_filename, location, duration = convert_and_save_file(browser, file, room_name, number)

    new_recording = Recording(
        filename=new_filename,
        duration=duration,
        room_name=room_name,
        url=app_settings.domain + app_settings.root_path + "/recording/file/" + new_filename,
        user_email=current_user.email
    )
    db.add(new_recording)
    db.commit()
    db.refresh(new_recording)

    transcript.delay(recording_name=new_filename, user_email=current_user.email)
    return {"info": f"file saved at '{location}'"}


@router.post(
    "/recordings-file",
    status_code=status.HTTP_201_CREATED
)
async def upload_new_recording_file(
        file: UploadFile,
        room_name: str = Form(),
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user),
):
    room = Room.get_room_by_name_for_user(db, room_name, current_user)
    if not room:
        raise RoomNotFound(room_name)
    number = len(room.recordings)

    temp_dir = "data/temp/"
    filename = f"{datetime.now().strftime('%d-%m-%Y')}-{room_name}-{str(number+1)}" + file.filename[-4:]

    with open(temp_dir + filename, "wb") as my_file:
        content = await file.read()
        my_file.write(content)
        my_file.close()

    if file.filename.endswith(".wav"):
        shutil.copyfile(
            temp_dir + filename,
            f"{app_settings.rooms_path}{room.name}/{app_settings.recordings_path}{filename}"
        )
        duration = get_duration(filename=temp_dir + filename)
    else:
        filename, duration = convert_to_wav_and_save_file(temp_dir, filename)
    os.remove(temp_dir + filename)

    new_recording = Recording(
        filename=filename,
        duration=duration,
        room_name=room_name,
        url=app_settings.domain + app_settings.root_path + "/recordings/file/" + filename,
        user_email=current_user.email
    )
    db.add(new_recording)
    db.commit()
    db.refresh(new_recording)

    transcript.delay(recording_name=filename, user_email=current_user.email)
    return {"info": f"File saved as '{filename}'"}


@router.get(
    "/recordings/file/{filename}",
    status_code=status.HTTP_200_OK
)
async def get_recording_file(
        background_tasks: BackgroundTasks,
        filename: str,
        st: float | None = None,
        et: float | None = None,
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user)
):
    recording = Recording.get_recording_by_filename_for_user(db, filename, current_user)
    file_path = f"{app_settings.rooms_path}{recording.room_name}/{app_settings.recordings_path}{filename}"
    if recording and os.path.exists(file_path):
        if not st or not et:
            return FileResponse(file_path, media_type="audio/wav")
        else:
            audio_file = AudioSegment.from_wav(file_path)[st*1000:et*1000]
            audio_file_with_fade = audio_file.apply_gain(volume_change=-15)\
                .fade(to_gain=15, start=0, end=1000)
            temp_file_path = f"data/temp/{filename[:-4]}-{token_urlsafe(8)}.wav"
            audio_file_with_fade.export(temp_file_path, format="wav")
            background_tasks.add_task(
                delete_audio_file,
                filepath=temp_file_path
            )
            return FileResponse(temp_file_path, media_type="audio/wav")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="File not found."
    )


@router.get(
    "/recordings/{recording_id}",
    status_code=status.HTTP_200_OK,
    response_model=recording_schemas.Recording
)
async def get_recording_info(
        recording_id: int,
        db: Session = Depends(get_db),
        current_user: user_schemas.User = Depends(check_if_active_user),
):
    recording = Recording.get_recording_by_id_for_user(db, recording_id, current_user)
    if not recording:
        raise RecordingNotFound(recording_id)
    return recording


@router.delete(
    "/recordings/{recording_id}"
)
async def delete_recording(
        recording_id: int,
        current_user: user_schemas.User = Depends(check_if_active_user),
        db: Session = Depends(get_db),
):
    recording_to_delete = Recording.get_recording_by_id_for_user(db, recording_id, current_user)
    if not recording_to_delete:
        raise RecordingNotFound(recording_id)

    file_path = f"{app_settings.rooms_path}{recording_to_delete.room_name}/{app_settings.recordings_path}" \
                + recording_to_delete.filename
    try:
        os.remove(file_path)
    except Exception as e:
        print({"Error": e})

    if recording_to_delete.transcription:
        file_path = f"{app_settings.rooms_path}{recording_to_delete.room.name}/" \
                    f"{app_settings.transcriptions_path}{recording_to_delete.transcription.filename}"
        try:
            os.remove(file_path)
        except Exception as e:
            print({"Error": e})

    db.delete(recording_to_delete)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
