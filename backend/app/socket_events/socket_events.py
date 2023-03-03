import socketio

from auth.jwt_helper import get_current_user
from db.database import db_session
from models.direct_channel import DirectChannel
from redis_client.redis_sid import get_redis_sid_client


sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=[]
)
socket_app = socketio.ASGIApp(
    socketio_server=sio,
    socketio_path="/sockets/"
)

redis_sid = get_redis_sid_client()


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
        redis_sid.add_user_sid(user_email=user.email, sid=sid)
        for room in user.rooms:
            sio.enter_room(sid, room=room.name)
            print(f"'RoomEvent: user has joined the room '{room.name}'\n'")
        direct_channels = DirectChannel.get_all_direct_channels_for_user(db_session, user)
        for direct_channel in direct_channels:
            sio.enter_room(sid, room=str(direct_channel.id))
            print(f"RoomEvent: user has joined the room '{direct_channel.id}'\n")
    except Exception as e:
        print(e)
    finally:
        db_session.close()
    return False if not user else print(sid, 'connected')


@sio.event
async def disconnect(sid):
    for email in redis_sid.get_all_users():
        redis_sid.remove_user_sid(
            user_email=email,
            sid=sid
        )
    print(sid, 'disconnected')


@sio.on('join')
async def join(sid, room):
    sio.enter_room(sid, room)
    print(f"RoomEvent: user has joined the room '{room}'\n")


@sio.on('leave')
async def leave(sid, room):
    sio.leave_room(sid, room)
    print(f"RoomEvent: user has left the room '{room}'\n")
