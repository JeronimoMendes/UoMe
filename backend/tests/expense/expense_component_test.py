from sqlmodel import select

from app.core.db import Session
from app.models import User
from app.schemas.expenses_schema import ExpenseCreate, ExpenseParticipantCreate
from app.services.expense_service import (
    create_expense,
    delete_expense,
    get_expense,
    get_group_expenses,
    get_user_expenses,
)


def test_create_expense(db: Session, user: User):
    second_participant = db.exec(select(User).where(User.username == "cristianoronaldo")).first()
    fake_expense = ExpenseCreate(
        amount=100.0,
        description="Test expense",
        date="2024-05-12T22:40:00.992740",
        group_id=second_participant.groups[0].id,
        type="test",
        participants=[
            ExpenseParticipantCreate(user_id=user.id, amount=100.0),
            ExpenseParticipantCreate(user_id=second_participant.id, amount=-50.0),
        ],
    )
    expense = create_expense(db, fake_expense, user)
    assert expense.amount == fake_expense.amount
    assert expense.description == fake_expense.description
    assert expense.date == fake_expense.date
    assert expense.created_by == user.id
    assert expense.group_id == fake_expense.group_id
    assert expense.type == fake_expense.type

    expense_query = get_expense(db, expense.id)
    assert expense_query == expense
    assert len(expense_query.participants) == 2
    assert expense_query.participants[0].expense_id == expense.id
    assert expense_query.participants[0].user_id == user.id
    assert expense_query.participants[0].amount == 100.0
    assert expense_query.participants[1].expense_id == expense.id
    assert expense_query.participants[1].user_id == second_participant.id
    assert expense_query.participants[1].amount == -50.0
    assert expense_query.group == second_participant.groups[0]


def test_delete_expense(db: Session, user: User):
    second_participant = db.exec(select(User).where(User.username == "cristianoronaldo")).first()
    fake_expense = ExpenseCreate(
        amount=100.0,
        description="Test expense",
        date="2024-05-12T22:40:00.992740",
        group_id=second_participant.groups[0].id,
        type="test",
        participants=[
            ExpenseParticipantCreate(user_id=user.id, amount=100.0),
            ExpenseParticipantCreate(user_id=second_participant.id, amount=-50.0),
        ],
    )
    expense = create_expense(db, fake_expense, user)

    expense_query = get_expense(db, expense.id)
    assert expense_query == expense

    delete_expense(db, expense.id)

    expense_query = get_expense(db, expense.id)
    assert expense_query is None


def test_get_user_expenses(db: Session):
    user = db.exec(select(User).where(User.username == "cristianoronaldo")).first()
    fake_expenses = [
        ExpenseCreate(
            amount=100.0,
            description="Test expense",
            date="2024-05-12T22:40:00.992740",
            type="test",
            group_id=user.groups[0].id,
            participants=[
                ExpenseParticipantCreate(user_id=user.id, amount=100.0),
            ],
        )
        for _ in range(5)
    ]

    for fake_expense in fake_expenses:
        create_expense(db, fake_expense, user)

    expenses = get_user_expenses(db, user.id)
    assert len(expenses) == 5
    for expense in expenses:
        assert expense.created_by == user.id
        assert expense.group_id == user.groups[0].id


def test_get_group_expenses(db: Session):
    user = db.exec(select(User).where(User.username == "cristianoronaldo")).first()
    fake_expenses = [
        ExpenseCreate(
            amount=100.0,
            description="Test expense",
            date="2024-05-12T22:40:00.992740",
            type="test",
            group_id=user.groups[0].id,
            participants=[
                ExpenseParticipantCreate(user_id=user.id, amount=100.0),
            ],
        )
        for _ in range(5)
    ]
    for fake_expense in fake_expenses:
        create_expense(db, fake_expense, user)

    expenses = get_group_expenses(db, user.id)
    assert len(expenses) == 5
    for expense in expenses:
        assert expense.created_by == user.id
        assert expense.group_id == user.groups[0].id
