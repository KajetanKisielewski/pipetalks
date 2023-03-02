import json
import pytest
from settings import get_settings

app_settings = get_settings()


@pytest.mark.xfail
def test_empty_db_rooms(client, register_users):
    response = client.get(f'{app_settings.root_path}/rooms')
    assert len(response.json()["records"]) > 0


def test_create_room(client):
    data_room = {
        "name": "test",
        "is_public": True
    }
    response = client.post(f'{app_settings.root_path}/rooms', json.dumps(data_room))
    assert response.status_code == 201


def test_get_all_rooms(client):
    response = client.get(f'{app_settings.root_path}/rooms')
    assert response.status_code == 200
    assert len(response.json()["records"]) == 1


def test_join_room(client):
    response = client.put(f'{app_settings.root_path}/rooms/test', json.dumps({"user_emails": ["test@test.com"]}))
    assert response.status_code == 202


def test_get_room(client):
    response = client.get(f'{app_settings.root_path}/rooms/test')
    assert response.status_code == 200
    assert response.json()["name"] == "test"
    assert len(response.json()["users"]) == 2


def test_delete_room(client):
    response = client.delete(f'{app_settings.root_path}/rooms/test')
    assert response.status_code == 401
