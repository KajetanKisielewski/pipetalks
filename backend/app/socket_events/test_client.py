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
        "http://localhost:8000/socket.io",
        headers={'Authentication': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJleHAiOjE2NzY5MTE4ODd9.WVupDBpRRFFglhmszg2o5VxkbltdoCuvaEYxSzWh7Uw'}
    )
    cl.wait()


if __name__ == '__main__':
    main()