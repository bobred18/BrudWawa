import base64
import json

import firebase_admin
from firebase_admin import credentials, messaging

from app.core.config import settings

_initialized = False


def _init():
    global _initialized
    if _initialized:
        return
    creds_json = json.loads(base64.b64decode(settings.firebase_credentials_b64))
    cred = credentials.Certificate(creds_json)
    firebase_admin.initialize_app(cred)
    _initialized = True


def send_broadcast(title: str, body: str) -> str:
    _init()
    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        topic="map_updates",
    )
    return messaging.send(message)
