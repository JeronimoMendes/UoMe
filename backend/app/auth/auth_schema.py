import uuid

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default=uuid.uuid4(), nullable=False)
    username: str
    email: str
    password: str


class CreateUser(SQLModel):
    name: str
    email: str
    password: str


class UserResponse(SQLModel):
    id: uuid.UUID
    username: str
    email: str
