import socketio

cl = socketio.Client()


@cl.event
def connect():
    print("Connected")


@cl.event
def connect_error(e):
    print(e)


@cl.event
def disconnect():
    print("Disconnected")


@cl.on("event_name")
def event_name(data):
    print(f"data {data}")


def main():
    cl.connect(
        "ws://localhost:8000/",
        socketio_path='sockets',
        headers={'Authentication': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE2NzY5ODc2NDh9.88ke51J5j6xoa9CaykqKqnyGMTEQb6wA7T4d-Mg9IyY'}
    )
    cl.wait()


if __name__ == '__main__':
    main()
