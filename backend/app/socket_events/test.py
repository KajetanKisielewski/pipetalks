import socketio


cl = socketio.Client()


@cl.on("event_name")
def foo(data):
    print(f"client 1 {data}")


cl.connect("http://localhost:8000/socket.io")
cl.emit("direct", "msg_1")
