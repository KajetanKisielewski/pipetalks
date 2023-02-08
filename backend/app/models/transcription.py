from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from db.database import Base
from .recording import Recording


class Transcription(Base):
    __tablename__ = "transcription"
    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(256), nullable=False)
    url = Column(String(256), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    recording_id = Column(Integer, ForeignKey("recording.id", ondelete='CASCADE'))
    recording = relationship("Recording", back_populates="transcription")

    def __repr__(self):
        return f"<id: {self.id}, recording-id: {self.recording_id}>"

    @staticmethod
    def get_all_transcriptions_for_user(db, user):
        return db.query(Transcription).join(Recording).filter(Recording.user == user).all()

    @staticmethod
    def get_transcription_by_id_for_user(db, transcription_id, user):
        return db.query(Transcription).filter(Transcription.id == transcription_id)\
            .join(Recording).filter(Recording.user == user).first()

    @staticmethod
    def get_transcription_by_filename_for_user(db, filename, user):
        return db.query(Transcription).filter(Transcription.filename == filename)\
            .join(Recording).filter(Recording.user == user).first()
