# Pipelines voice chat

Pipelines chat is an app that uses various technologies to provide audio chat by recordings with transcriptions 
generated automatically. Transcription files are stored as well as audio files recorded from voice chat.
Now you can always come back to re-enter specific voice chat and hear it again with it highlighted real-time
transcription during audio playback.

You can create public and private chat rooms as well as direct voice messages.
App provides notifications about new messages via SocketIO events and stores unread messages 
count in Redis database for every user.

## Technologies used
* FastAPI
* React
* GCP
* SocketIO
* PostgreSQL
* Docker
* Redis

## Installation

To fully experience this app you should set it up on server machine with domain attached to its IP address.
For instance, you could use Google Compute Engine and Cloud Domains with Cloud DNS. 
Do not forget about SSL certificate to prepare app for HTTPS protocol.

Whole app starts using **docker-compose** so please make sure you have it available on your machine or simply install it.

Speech-2-txt component is based on Google Cloud Speech-to-text. 
To make it work you should prepare service-account json key.
[Here](https://cloud.google.com/speech-to-text/docs/before-you-begin) you can read simple guide how to prepare that.
Rename it to sa-key.json and place it in **app/** directory.


#### Installation on production environment
1. Change email and domain in docker-compose yaml files to match yours.
2. Change domain name on nginx-server/prod.nginx.conf file to match yours.
3. Start docker-compose yaml file that creates SSL certificate:

```
docker-compose -f cert.docker-compose.yaml up --build -d
```

4. Stop containers after certificate creation:

```
docker-compose -f cert.docker-compose.yaml down
```

5. Start docker-compose yaml file with app containers:

```
docker-compose -f prod.docker-compose.yaml up --build -d
```

#### Installation on development environment
1. Start docker-compose development yaml file:

```
docker-compose up --build -d
```