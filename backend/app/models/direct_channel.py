from sqlalchemy import Column, Integer, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from db.database import Base


direct_channel_user_association_table = Table(
    "direct_channel_user_association_table",
    Base.metadata,
    Column("direct_channel_id", ForeignKey("direct_channel.id")),
    Column("user_id", ForeignKey("user.id"))
)


class DirectChannel(Base):
    __tablename__ = "direct_channel"
    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    recordings = relationship(
        "Recording",
        back_populates="direct_channel",
        cascade="all, delete-orphan"
    )
    users = relationship(
        "User",
        secondary=direct_channel_user_association_table,
    )

    @staticmethod
    def get_all_direct_channels_for_user(db, user):
        return db.query(DirectChannel).filter(DirectChannel.users.contains(user)).all()

    @staticmethod
    def get_direct_channel_by_id_for_user(db, user, channel_id):
        return db.query(DirectChannel).filter(DirectChannel.users.contains(user)) \
            .filter(DirectChannel.id == channel_id).first()

    @staticmethod
    def get_direct_channels_for_two_users(db, user1, user2):
        return db.query(DirectChannel).filter(DirectChannel.users.contains(user1))\
            .filter(DirectChannel.users.contains(user2)).first()
