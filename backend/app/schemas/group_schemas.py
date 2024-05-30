from uuid import UUID

from sqlmodel import SQLModel

from app.schemas.auth_schema import UserResponse
from app.schemas.expenses_schema import ExpenseResponse


class GroupCreate(SQLModel):
    name: str
    description: str = ""


class GroupView(SQLModel):
    id: UUID
    name: str
    description: str = ""
    members: list[UserResponse] = []
    expenses: list[ExpenseResponse] = []
