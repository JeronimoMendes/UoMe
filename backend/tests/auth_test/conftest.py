import pytest

from app.core.db import Session
from app.schemas.auth_schema import CreateUser, User
from app.services.auth_service import create_user


@pytest.fixture
def user(db: Session) -> User:
    user = CreateUser(username="test", email="test@gmail.com", password="test")
    user = create_user(db, user)
    return user
