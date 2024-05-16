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


class ExpenseParticipantCreate(SQLModel):
    user_id: UUID
    amount: float
