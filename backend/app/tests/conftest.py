import pytest
import json
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database, drop_database

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from db.database import Base, get_db
from models.user import User
from auth.jwt_helper import get_current_user
from settings import get_settings

app_settings = get_settings()

postgres_user = app_settings.postgres_user
postgres_password = app_settings.postgres_password
postgres_host = app_settings.postgres_host
redis_password = app_settings.redis_password
redis_port = app_settings.redis_port
redis_host = app_settings.redis_host

SQLALCHEMY_DATABASE_URL = f"postgresql://{postgres_user}:{postgres_password}@{postgres_host}/test_db"
CELERY_RESULT_BACKEND = f"{postgres_host}+postgresql+psycopg2://{postgres_user}:{postgres_password}@{postgres_host}" \
                        f"/test_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionTesting = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def db_engine():
    if not database_exists(SQLALCHEMY_DATABASE_URL):
        create_database(engine.url)
    Base.metadata.create_all(bind=engine)
    yield engine
    drop_database(SQLALCHEMY_DATABASE_URL)


@pytest.fixture(scope="module")
def db(db_engine):
    connection = db_engine.connect()
    connection.begin()
    db = SessionTesting(bind=connection)
    yield db
    db.rollback()
    connection.close()


@pytest.fixture(scope="module")
def client(db):
    app.dependency_overrides[get_db] = lambda: db

    async def avoid_token():
        user = User.get_user_by_email(db, "email@email.com")
        if user:
            return user
        return User(
            name="name",
            email="email@email.com",
            is_active=True,
            is_admin=False
        )

    app.dependency_overrides[get_current_user] = avoid_token
    with TestClient(app) as c:
        yield c


@pytest.fixture
def register_users(client):
    data_users = [
        {
            "name": "name",
            "email": "email@email.com",
            "password": "password123"
        },
        {
            "name": "test",
            "email": "test@test.com",
            "password": "password123"
        },
    ]
    [client.post(f'{app_settings.root_path}/register', json.dumps(data_user)) for data_user in data_users]
