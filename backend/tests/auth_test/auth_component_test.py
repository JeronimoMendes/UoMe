import pytest
from sqlmodel import select

from app.auth.auth_schema import CreateUser, User
from app.auth.auth_service import authenticate_user, create_user
from app.core.db import Session


def test_create_user(db: Session):
    user = CreateUser(username="test", email="test@gmail.com", password="test")
    new_user = create_user(db, user)

    assert new_user.username == user.username
    assert new_user.email == user.email
    assert new_user.password != user.password
    assert new_user.id is not None


def test_create_user_duplicate(db):
    # no users with duplicate emails or usernames shall be created
    user = CreateUser(username="test", email="test@gmail.com", password="test")
    create_user(db, user)
    with pytest.raises(Exception):
        create_user(db, user)

    user2 = CreateUser(username="test2", email="test@gmail.com", password="test")
    with pytest.raises(Exception):
        create_user(db, user2)

    user3 = CreateUser(username="test", email="test2@gmail.com", password="test")
    with pytest.raises(Exception):
        create_user(db, user3)

    # check if the second user was not created
    query = db.exec(select(User).where(User.email == user.email))
    assert len(query.fetchall()) == 1


def test_authenticate_user(db: Session, user: User):
    auth_user = authenticate_user(db, user.email, "test")

    # check if the auth user matches the user
    assert auth_user.id == user.id
    assert auth_user.username == user.username
    assert auth_user.email == user.email
    assert auth_user.password == user.password


def test_authenticate_unexistant_user(db: Session):
    auth_user = authenticate_user(db, "test1@gmail.com", "test")
    assert auth_user is False


def test_authenticate_wrong_password(db: Session, user: User):
    auth_user = authenticate_user(db, user.email, "test1")
    assert auth_user is False
