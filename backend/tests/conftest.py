import logging
import os
from typing import Callable, Generator

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlmodel import SQLModel

from app.core.db import Session, create_engine, get_db
from app.main import app
from app.models import User
from app.services.auth_service import CreateUser, create_user
from tests.populate_db import populate_db

LOGGER = logging.getLogger(__name__)

load_dotenv(".env.test")

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@host.docker.internal:5432/test_db")

LOGGER.info(f"DB_URL: {DB_URL}")

TEST_ENGINE = create_engine(DB_URL)


@pytest.fixture
def db(populated_db: None) -> Generator[Session, None, None]:
    with TEST_ENGINE.begin() as conn:
        session = Session(bind=conn)
        yield session
        session.flush()
        session.rollback()
        session.close()


@pytest.fixture(scope="session")
def populated_db() -> None:
    with TEST_ENGINE.begin() as conn:
        SQLModel.metadata.drop_all(conn)
        SQLModel.metadata.create_all(conn)

        with Session(bind=conn) as session:
            populate_db(session)
            session.close()


@pytest.fixture()
def override_get_db(db: Session) -> Callable:
    async def _override_get_db():
        yield db

    return _override_get_db


@pytest.fixture
def app_client(populated_db, override_get_db: Callable) -> TestClient:
    test_app = TestClient(app)
    test_app.app.dependency_overrides[get_db] = override_get_db
    return test_app


@pytest.fixture
def authenticated_client(app_client) -> Generator[TestClient, None, None]:
    email = "joedoe@gmail.com"
    password = "easy-pw-123"

    res = app_client.post(
        "/token",
        data={
            "username": email,
            "password": password,
        },
    )

    print(res.json())

    access_token = res.json()["access_token"]

    app_client.headers.update(
        {
            "Authorization": f"Bearer {access_token}",
        }
    )

    return app_client


@pytest.fixture
def user(db: Session) -> User:
    user = CreateUser(username="test", email="test@gmail.com", password="test")
    user = create_user(db, user)
    db.commit()
    return user
