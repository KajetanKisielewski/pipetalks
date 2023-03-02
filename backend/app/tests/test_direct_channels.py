import pytest
from settings import get_settings

app_settings = get_settings()


@pytest.mark.xfail
def test_empty_db_direct_channels(client, register_users):
    response = client.get(f'{app_settings.root_path}/direct-channels')
    assert len(response.json()["records"]) > 0


def test_get_direct_channel(client):
    response = client.get(f'{app_settings.root_path}/direct-channels/test@test.com')
    assert response.status_code == 201
    response = client.get(f'{app_settings.root_path}/direct-channels/test@test.com')
    assert response.status_code == 200


def test_get_all_direct_channels(client):
    response = client.get(f'{app_settings.root_path}/direct-channels')
    assert response.status_code == 200
    assert len(response.json()["records"]) == 1
