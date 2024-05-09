from uuid import uuid4

from app.auth.auth_schema import User
from app.auth.auth_service import pwd_context
from app.core.db import Session


def populate_db(db: Session) -> None:
    pw = pwd_context.hash("easy-pw-123")
    user1 = User(
        id=uuid4(),
        email="joedoe@gmail.com",
        username="joedoe",
        password=pw,
    )
    user2 = User(
        id=uuid4(),
        email="louishamilton@gmail.com",
        username="louishamilton",
        password=pw,
    )
    user3 = User(
        id=uuid4(),
        email="cristianoronaldo@gmail.com",
        username="cristianoronaldo",
        password=pw,
    )
    db.add(user1)
    db.add(user2)
    db.add(user3)
