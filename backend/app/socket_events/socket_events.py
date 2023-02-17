import socketio

from auth.jwt_helper import get_current_user
from db.database import db_session


sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins='*'
)
socket_app = socketio.ASGIApp(
    socketio_server=sio,
    socketio_path="socket.io"
)


@sio.event
async def connect(sid, environ):
    headers = environ.get('asgi.scope').get('headers')
    user = None
    token = None
    for header in headers:
        if header[0].decode("utf-8") == 'authentication':
            token = header[1].decode("utf-8")
    if not token:
        return False
    try:
        user = get_current_user(token, db_session)
        for room in user.rooms:
            sio.enter_room(sid, room=room.name)
            print(f'RoomEvent: user has joined the room {room.name}\n')
    except Exception as e:
        print(e)
    finally:
        db_session.close()
    return False if not user else print(sid, 'connected')


@sio.event
async def disconnect(sid):
    print(sid, 'disconnected')


@sio.on('join')
async def join(sid, room):
    sio.enter_room(sid, room)
    print(f'RoomEvent: user has joined the room {room}\n')


@sio.on('leave')
async def leave(sid, room):
    sio.leave_room(sid, room)
    print(f'RoomEvent: user has left the room {room}\n')
