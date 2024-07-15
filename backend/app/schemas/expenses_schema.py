from datetime import datetime
from uuid import UUID

from sqlmodel import SQLModel

from app.schemas.auth_schema import UserResponse


class ExpenseCreate(SQLModel):
    amount: float
    description: str
    date: datetime
    group_id: UUID
    type: str
    participants: list["ExpenseParticipantCreate"]


class PaymentCreate(SQLModel):
    amount: float
    date: datetime
    group_id: UUID | None = None
    user_payee_id: UUID
    user_payer_id: UUID | None = None


class ExpenseParticipantResponse(SQLModel):
    user: UserResponse
    amount: float


class GroupExpenseView(SQLModel):
    id: UUID
    name: str


class ExpenseResponse(SQLModel):
    id: UUID
    amount: float
    description: str
    date: datetime
    group_id: UUID
    group: GroupExpenseView
    type: str
    participants: list[ExpenseParticipantResponse]


class ExpenseParticipantCreate(SQLModel):
    user_id: UUID
    amount: float


class PaymentResponse(SQLModel):
    amount: float
    date: datetime
    group_id: UUID | None = None
    user_payee: UserResponse
    user_payer: UserResponse


class ExpenseQuery(SQLModel):
    start_date: datetime | None = None
    end_date: datetime | None = None
    type: str | None = None
