import socketio

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins='*'
)
socket_app = socketio.ASGIApp(
    socketio_server=sio,
    socketio_path="socket.io"
)


@sio.on("direct")
async def direct(sid, msg):
    print(f"direct {msg}")
    await sio.emit("event_name", msg, room=sid)
