from datetime import datetime
from uuid import UUID

from sqlmodel import SQLModel


class ExpenseCreate(SQLModel):
    amount: float
    description: str
    date: datetime
    group_id: UUID
    type: str
    participants: list["ExpenseParticipantCreate"]


class ExpenseParticipantResponse(SQLModel):
    user_id: UUID
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
