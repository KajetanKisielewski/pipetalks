from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from db.database import Base


class Transcription(Base):
    __tablename__ = "transcription"
    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(256), nullable=False)
    url = Column(String(256), nullable=False)
    language = Column(String(32), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    recording_id = Column(Integer, ForeignKey("recording.id", ondelete='CASCADE'))
    recording = relationship("Recording", back_populates="transcription")

    def __repr__(self):
        return f"<id: {self.id}, recording-id: {self.recording_id}>"

    @staticmethod
    def get_transcription_by_id_for_user(db, transcription_id, user):
        try:
            transcription = db.query(Transcription).filter(Transcription.id == transcription_id).first()
            if transcription.recording.room_name:
                if user in transcription.recording.room.users:
                    return transcription
            elif transcription.recording.direct_channel_id:
                if user in transcription.recording.direct_channel.users:
                    return transcription
            else:
                return None
        except AttributeError:
            return None

    @staticmethod
    def get_transcription_by_filename_for_user(db, filename, user):
        try:
            transcription = db.query(Transcription).filter(Transcription.filename == filename).first()
            if transcription.recording.room_name:
                if user in transcription.recording.room.users:
                    return transcription
            elif transcription.recording.direct_channel_id:
                if user in transcription.recording.direct_channel.users:
                    return transcription
            else:
                return None
        except AttributeError:
            return None
