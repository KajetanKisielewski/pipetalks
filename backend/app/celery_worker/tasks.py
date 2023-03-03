import json
import logging
import requests
from datetime import datetime

from celery import Task

from langdetect import detect

from .celery import app
from db.database import db_session
from settings import get_settings
from models.transcription import Transcription
from models.recording import Recording
from models.user import User
from utils.cloud_storage_client import get_client
from utils.cloud_transcript_file import transcript_big_bucket_file_gcp
from utils.autocorrect_nlp import save_autocorrected_text

logging.getLogger(__name__)
app_settings = get_settings()

storage_client = get_client()


class SQLAlchemyTask(Task):
    """
    An abstract Celery Task that ensures that the connection the
    database is closed on task completion
    """
    abstract = True

    def after_return(self, status, retval, task_id, args, kwargs, einfo):
        db_session.remove()


@app.task(name="transcript", base=SQLAlchemyTask)
def transcript(recording_name: str, user_email: str):
    """
    Creates transcription for chosen recording via Google Cloud Speech-to-text.
    Saves transcription to txt file and stores path and whole info in db.
    """
    user = User.get_user_by_email(db_session, user_email)
    recording = Recording.get_recording_by_filename_for_user(db_session, recording_name, user)

    transcription_filename = f"{recording.filename.split('.')[0]}.txt"
    if recording.room_name:
        recording_filepath = \
            f"{app_settings.rooms_path}{recording.room_name}/{app_settings.recordings_path}{recording.filename}"
        transcription_filepath = \
            f"{app_settings.rooms_path}{recording.room_name}/{app_settings.transcriptions_path}{transcription_filename}"
        channel = recording.room_name
    else:
        recording_filepath = \
            f"{app_settings.direct_channels_path}{recording.direct_channel_id}/" \
            f"{app_settings.recordings_path}{recording.filename}"
        transcription_filepath = \
            f"{app_settings.direct_channels_path}{recording.direct_channel_id}/" \
            f"{app_settings.transcriptions_path}{transcription_filename}"
        channel = recording.direct_channel_id

    storage_client.upload(recording.filename, recording_filepath)
    blob_uri = storage_client.get_blob_uri(recording.filename)
    blob_uri = blob_uri.replace('/o/', '/')
    result = transcript_big_bucket_file_gcp(blob_uri, user.settings.language.code)

    transcription_text = ''
    for result in result.results:
        alternative = result.alternatives[0]
        timestamp = datetime.utcnow().strftime('%Y/%m/%d, %H:%M:%S')
        words = ''
        timestamps = ''
        for word_info in alternative.words:
            words += f"{word_info.word.lower()} "
            timestamps += f"{word_info.start_time.total_seconds()},"
        transcription_text += \
            f"[{timestamp}] - [{user.name}] - [{timestamps[:-1]}] - {words.strip()}.\n"

    save_autocorrected_text(transcription_text, transcription_filepath)
    languages = {
        'pl': 'pl-PL',
        'en': 'en-US',
        'de': 'de-DE',
        'fr': 'fr-FR',
        'es': 'es-ES',
    }
    language = languages.get(detect(transcription_text))
    transcription = Transcription(
        filename=transcription_filename,
        url=app_settings.domain + app_settings.root_path + "/transcriptions/file/" + transcription_filename,
        recording_id=recording.id,
        language=language if language else user.settings.language.code
    )
    db_session.add(transcription)
    db_session.commit()
    db_session.refresh(transcription)

    storage_client.delete_blob(recording.filename)

    requests.post(
        url=f"http://app:8000/api/v1/utils/emit-notifications",
        data=json.dumps(
            {
                "secret_key": app_settings.secret_key,
                "channel": channel,
                "sender": user_email
            }
        )
    )
