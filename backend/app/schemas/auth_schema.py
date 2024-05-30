import uuid

from sqlmodel import SQLModel


class CreateUser(SQLModel):
    username: str
    email: str
    password: str


class LoginUser(SQLModel):
    email: str
    password: str


class UserResponse(SQLModel):
    id: uuid.UUID
    username: str
    email: str
    image: str | None
