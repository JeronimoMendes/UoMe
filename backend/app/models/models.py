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

    # null is in case of oauth login
    password: str = Field(nullable=True)
    image: str = Field(nullable=True)

    groups: list["Group"] = Relationship(back_populates="users", link_model=UserGroup)
    expenses: list["ExpenseParticipant"] = Relationship(back_populates="user")

    payments_from: list["Payment"] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "Payment.user_payer_id"}, back_populates="user_payer"
    )
    payments_received: list["Payment"] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "Payment.user_payee_id"}, back_populates="user_payee"
    )


class Group(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True)
    name: str = Field(nullable=False)
    description: str
    created_at: datetime = Field(default=datetime.now(UTC))

    users: list[User] = Relationship(back_populates="groups", link_model=UserGroup)
    expenses: list["Expense"] = Relationship(back_populates="group")
    payments: list["Payment"] = Relationship(back_populates="group")

    # if id is not provided, generate a new uuid
    def __init__(self, **data):
        super().__init__(**data)
        if not self.id:
            self.id = uuid.uuid4()


class Expense(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True)
    amount: float = Field(nullable=False, gt=0.0)
    description: str = Field(nullable=False)
    date: datetime = Field(default=datetime.now(UTC))
    created_at: datetime = Field(default=datetime.now(UTC))
    created_by: uuid.UUID = Field(foreign_key="user.id")
    group_id: uuid.UUID = Field(foreign_key="group.id", nullable=True)
    type: str

    group: Group = Relationship(back_populates="expenses")
    participants: list["ExpenseParticipant"] = Relationship(back_populates="expense")


class Payment(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True)
    amount: float = Field(nullable=False, gt=0.0)
    date: datetime = Field(default=datetime.now(UTC))
    created_at: datetime = Field(default=datetime.now(UTC))
    created_by: uuid.UUID = Field(foreign_key="user.id")
    group_id: uuid.UUID = Field(foreign_key="group.id", nullable=True)
    user_payee_id: uuid.UUID = Field(foreign_key="user.id")
    user_payer_id: uuid.UUID = Field(foreign_key="user.id")

    user_payer: User = Relationship(
        sa_relationship_kwargs={"foreign_keys": "Payment.user_payer_id"}, back_populates="payments_from"
    )
    user_payee: User = Relationship(
        sa_relationship_kwargs={"foreign_keys": "Payment.user_payee_id"}, back_populates="payments_received"
    )
    group: Group = Relationship(back_populates="payments")


class ExpenseParticipant(SQLModel, table=True):
    expense_id: uuid.UUID = Field(foreign_key="expense.id", primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)
    # users who paid the expense will have a positive amount (total) in the amount field
    # while users who owe the expense will have a negative amount (partial) in the amount field
    amount: float = Field(nullable=False)

    user: User = Relationship(back_populates="expenses")
    expense: Expense = Relationship(back_populates="participants")
