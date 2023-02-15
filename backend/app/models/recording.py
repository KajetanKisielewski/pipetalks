from sqlalchemy import Column, Integer, DateTime, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy_utils import EmailType

from db.database import Base
from .user import User
from .room import Room
from .direct_channel import DirectChannel


class Recording(Base):
    __tablename__ = "recording"
    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(256), nullable=False)
    duration = Column(Float(precision=2), nullable=False, default=0)
    url = Column(String(256), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    room_name = Column(String, ForeignKey("room.name", ondelete='CASCADE'))
    room = relationship(
        "Room",
        back_populates="recordings"
    )
    direct_channel_id = Column(Integer, ForeignKey("direct_channel.id", ondelete='CASCADE'))
    direct_channel = relationship(
        "DirectChannel",
        back_populates="recordings"
    )
    transcription = relationship(
        "Transcription",
        back_populates="recording",
        uselist=False,
        cascade="all, delete-orphan",
    )
    user_email = Column(EmailType, ForeignKey("user.email", ondelete='SET NULL'))
    user = relationship(
        "User",
        back_populates="recordings"
    )

    def __repr__(self):
        return f"<id: {self.id}, length: {self.length}>"

    @staticmethod
    def get_recording_by_id_for_user(db, recording_id, user):
        try:
            recording = db.query(Recording).filter(Recording.id == recording_id).first()
            if recording.room_name:
                if user in recording.room.users:
                    return recording
            elif recording.direct_channel_id:
                if user in recording.direct_channel.users:
                    return recording
            else:
                return None
        except AttributeError:
            return None

    @staticmethod
    def get_recording_by_filename_for_user(db, filename, user):
        try:
            recording = db.query(Recording).filter(Recording.filename == filename).first()
            if recording.room_name:
                if user in recording.room.users:
                    return recording
            elif recording.direct_channel_id:
                if user in recording.direct_channel.users:
                    return recording
            else:
                return None
        except AttributeError:
            return None
