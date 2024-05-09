import logging
import os
from typing import Generator

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlmodel import SQLModel

from app.core.db import Session, create_engine
from app.main import app
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
            session.commit()
            session.close()


@pytest.fixture
def app_client(populated_db) -> TestClient:
    return TestClient(app)


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
