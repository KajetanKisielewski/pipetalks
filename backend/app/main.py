import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import transcriptions, auth, recordings, users, rooms, images, direct_channels, utils
from settings import get_settings
from socket_events.socket_events import socket_app
from redis_client.redis_sid import get_redis_sid_client

app_settings = get_settings()
redis_sid = get_redis_sid_client()


# Settings
settings = get_settings()

# FastAPI
app = FastAPI(
    docs_url=f"{settings.root_path}/docs",
    openapi_url=f"{settings.root_path}",
    version="1.0.0",
    title="Pipetalks"
)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(direct_channels.router)
app.include_router(rooms.router)
app.include_router(recordings.router)
app.include_router(transcriptions.router)
app.include_router(images.router)
app.include_router(utils.router)

# CORS middleware
origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Socket.io
app.mount("/", socket_app)

# Clear socket ids from redis
redis_sid.clear_db()

# Create directories
data_dir = "data/"
if not os.path.exists(data_dir):
    os.makedirs(data_dir)
temp_dir = "data/temp/"
if not os.path.exists(temp_dir):
    os.mkdir(temp_dir)
if not os.path.exists(app_settings.profile_images_path):
    os.makedirs(app_settings.profile_images_path)
if not os.path.exists(app_settings.rooms_path):
    os.makedirs(app_settings.rooms_path)
if not os.path.exists(app_settings.direct_channels_path):
    os.makedirs(app_settings.direct_channels_path)


if __name__ == '__main__':
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_config="./logging.yaml"
    )
