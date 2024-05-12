import uuid
from datetime import UTC, datetime

from sqlmodel import Field, Relationship, SQLModel


class UserGroup(SQLModel, table=True):
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)
    group_id: uuid.UUID = Field(foreign_key="group.id", primary_key=True)


class User(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default=uuid.uuid4(), nullable=False)
    username: str = Field(nullable=False, unique=True, index=True)
    email: str = Field(nullable=False, unique=True)
    password: str

    groups: list["Group"] = Relationship(back_populates="users", link_model=UserGroup)


class Group(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True)
    name: str = Field(nullable=False)
    description: str
    created_at: datetime = Field(default=datetime.now(UTC))

    users: list[User] = Relationship(back_populates="groups", link_model=UserGroup)

    # if id is not provided, generate a new uuid
    def __init__(self, **data):
        super().__init__(**data)
        if not self.id:
            self.id = uuid.uuid4()
