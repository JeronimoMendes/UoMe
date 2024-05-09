import os

import requests

BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:8000")


def get_backend_session(token: str = None):
    session = requests.Session()
    if token:
        session.headers.update({"Authorization": f"Bearer {token}"})

    return session
