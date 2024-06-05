from datetime import datetime
from uuid import UUID
from app.schemas.auth_schema import UserResponse

from sqlmodel import SQLModel


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
    group_id: UUID | None
    user_payee_id: UUID
    user_payer_id: UUID | None


class ExpenseParticipantResponse(SQLModel):
    user: UserResponse
    amount: float


class ExpenseResponse(SQLModel):
    id: UUID
    amount: float
    description: str
    date: datetime
    group_id: UUID
    type: str
    participants: list[ExpenseParticipantResponse]


class ExpenseParticipantCreate(SQLModel):
    user_id: UUID
    amount: float
