import uuid
from datetime import datetime, timedelta

from sqlalchemy import Column, String, DateTime, Text, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy_utils import EmailType, ChoiceType
from sqlalchemy.dialects.postgresql import UUID
from fastapi import HTTPException, status

from db.database import Base


class User(Base):
    __tablename__ = "user"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(EmailType, unique=True, nullable=False)
    password = Column(Text)
    name = Column(String(32), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    settings = relationship(
        "UserSettings",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )
    recordings = relationship(
        "Recording",
        back_populates="user"
    )

    def __repr__(self):
        return f"<id: {self.id}, email: {self.email}>"

    @staticmethod
    def get_all_users(db):
        return db.query(User).all()

    @staticmethod
    def get_user_by_id(db, user_id):
        try:
            uuid_user = uuid.UUID(user_id, version=4)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user id, try again."
            )
        if str(uuid_user) == user_id:
            return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_email(db, email):
        return db.query(User).filter(User.email == email).first()


class UserSettings(Base):
    LANGUAGES = [
        ('pl-PL', 'Polski'),
        ('en-US', 'English'),
        ('de-DE', 'Deutsch'),
        ('fr-FR', 'Francais'),
        ('es-ES', 'Espanol'),
    ]

    __tablename__ = "user_settings"
    id = Column(UUID(as_uuid=True), ForeignKey("user.id", ondelete='CASCADE'), primary_key=True, default=uuid.uuid4)
    user = relationship("User", back_populates="settings")
    image_URL = Column(String(256), nullable=True, default=None)
    language = Column(ChoiceType(LANGUAGES), default='pl-PL')
    auto_translate = Column(Boolean, default=False)
    translate_language = Column(ChoiceType(LANGUAGES), default='en-US')

    def __repr__(self):
        return f"<id: {self.id}, user: {self.user.email}>"


class ResetPassword(Base):
    __tablename__ = "reset_password"
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(128))
    reset_code = Column(String(128))
    status = Column(Boolean, default=False)
    expiry_time = Column(DateTime(timezone=True), default=datetime.utcnow()+timedelta(minutes=15))

    @staticmethod
    def get_unused_by_reset_code(db, reset_code):
        return db.query(ResetPassword)\
            .filter(ResetPassword.reset_code == reset_code)\
            .filter(ResetPassword.status == False)\
            .filter(ResetPassword.expiry_time > datetime.utcnow()).first()

    @staticmethod
    def get_unused_by_email(db, email):
        return db.query(ResetPassword)\
            .filter(ResetPassword.email == email)\
            .filter(ResetPassword.status == False)\
            .filter(ResetPassword.expiry_time > datetime.utcnow()).first()
