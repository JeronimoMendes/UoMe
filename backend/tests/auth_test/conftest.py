import pytest

from app.auth.auth_schema import CreateUser, User
from app.auth.auth_service import create_user
from app.core.db import Session


@pytest.fixture
def user(db: Session) -> User:
    user = CreateUser(username="test", email="test@gmail.com", password="test")
    user = create_user(db, user)
    return user
