"""1_init_models

Revision ID: 52a5bff579bc
Revises: 
Create Date: 2023-02-07 07:25:03.411101

"""
import uuid
from auth.hash import Hash
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import sqlalchemy_utils

# revision identifiers, used by Alembic.
revision = '52a5bff579bc'
down_revision = None
branch_labels = None
depends_on = None

LANGUAGES = [
        ('pl-PL', 'Polski'),
        ('en-US', 'English'),
        ('de-DE', 'Deutsch'),
        ('fr-FR', 'Francais'),
        ('es-ES', 'Espanol'),
    ]


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('reset_password',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('email', sa.String(length=128), nullable=True),
    sa.Column('reset_code', sa.String(length=128), nullable=True),
    sa.Column('status', sa.Boolean(), nullable=True),
    sa.Column('expiry_time', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('room',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    users_table = op.create_table('user',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('email', sqlalchemy_utils.types.email.EmailType(length=255), nullable=False),
    sa.Column('password', sa.Text(), nullable=True),
    sa.Column('name', sa.String(length=32), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('is_admin', sa.Boolean(), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('recording',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('filename', sa.String(length=256), nullable=False),
    sa.Column('duration', sa.Float(precision=2), nullable=False),
    sa.Column('url', sa.String(length=256), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('room_name', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['room_name'], ['room.name'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('room_user_association_table',
    sa.Column('room_id', sa.String(), nullable=True),
    sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.ForeignKeyConstraint(['room_id'], ['room.name'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], )
    )
    op.create_table('transcription',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('filename', sa.String(length=256), nullable=False),
    sa.Column('url', sa.String(length=256), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('room_name', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['room_name'], ['room.name'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    user_settings = op.create_table('user_settings',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('image_URL', sa.String(length=256), nullable=True),
    sa.Column('language', sqlalchemy_utils.types.choice.ChoiceType(LANGUAGES), nullable=True),
    sa.Column('auto_translate', sa.Boolean(), nullable=True),
    sa.Column('translate_language', sqlalchemy_utils.types.choice.ChoiceType(LANGUAGES), nullable=True),
    sa.ForeignKeyConstraint(['id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )

    op.bulk_insert(
        users_table,
        [
            {
                "id": uuid.UUID("00000000-0000-4000-a000-000000000000"),
                "email": "admin@admin.com",
                "password": Hash.get_password_hash("admin"),
                "name": "Admin",
                "is_active": True,
                "is_admin": True
            }
        ]
    )

    op.bulk_insert(
        user_settings,
        [
            {
                "id": uuid.UUID("00000000-0000-4000-a000-000000000000"),
                "image_URL": None,
                "language": 'pl-PL',
                "auto_translate": False,
                "translate_language": 'en-US'
            }
        ]
    )

    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_settings')
    op.drop_table('transcription')
    op.drop_table('room_user_association_table')
    op.drop_table('recording')
    op.drop_table('user')
    op.drop_table('room')
    op.drop_table('reset_password')
    # ### end Alembic commands ###
