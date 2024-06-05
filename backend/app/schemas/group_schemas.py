from uuid import UUID

from sqlmodel import SQLModel

from app.schemas.auth_schema import UserResponse
from app.schemas.expenses_schema import ExpenseResponse, PaymentResponse


class GroupCreate(SQLModel):
    name: str
    description: str = ""


class Debt(SQLModel):
    user: UserResponse
    amount: float


class GroupView(SQLModel):
    id: UUID
    name: str
    description: str = ""
    members: list[UserResponse] = []
    expenses: list[ExpenseResponse] = []
    balance: float = 0.0
    owed: float = 0.0
    owes: float = 0.0
    debts: list[Debt] = []
    payments: list[PaymentResponse] = []
