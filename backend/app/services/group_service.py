from uuid import UUID

from fastapi.exceptions import HTTPException
from sqlmodel import select

from app.core.db import Session
from app.models import Group, User, UserGroup, ExpenseParticipant, Expense, Payment
from app.schemas.group_schemas import GroupCreate, GroupView, Debt
from sqlalchemy import func


def create_group(db: Session, group: GroupCreate, username: str) -> Group:
    user = db.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    new_group = Group(name=group.name, description=group.description)
    db.add(new_group)

    # make the group creator a member of the group
    user_group = UserGroup(user_id=user.id, group_id=new_group.id)
    user_group = db.add(user_group)

    return new_group


def delete_group(db: Session, group_id: UUID) -> None:
    group = db.exec(select(Group).where(Group.id == group_id)).first()
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")

    db.delete(group)


def add_user_to_group(db: Session, email: str, group_id: UUID) -> None:
    print(email)
    user = db.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    group = db.exec(select(Group).where(Group.id == group_id)).first()
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")

    group_user = db.exec(
        select(UserGroup).where(UserGroup.user_id == user.id).where(UserGroup.group_id == group_id)
    ).first()
    if group_user is not None:
        raise HTTPException(status_code=400, detail="User already in group")

    user_group = UserGroup(user_id=user.id, group_id=group_id)
    db.add(user_group)


def remove_user_from_group(db: Session, email: str, group_id: UUID) -> None:
    user = db.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = user.id

    group = db.exec(select(Group).where(Group.id == group_id)).first()
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")

    user_group = db.exec(
        select(UserGroup).where(UserGroup.user_id == user_id).where(UserGroup.group_id == group_id)
    ).first()
    if user_group is None:
        raise HTTPException(status_code=404, detail="User not in group")

    db.delete(user_group)


def get_group(db: Session, group_id: UUID, user: User) -> GroupView:
    group = db.get(Group, group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")

    owed, owes = 0.0, 0.0
    owed = db.scalar(
        select(func.coalesce(func.sum(ExpenseParticipant.amount), 0))
        .join(Expense)
        .filter(
            ExpenseParticipant.expense_id.in_(
                select(ExpenseParticipant.expense_id)
                .join(Expense)
                .filter(
                    ExpenseParticipant.user_id == user.id, Expense.group_id == group_id, ExpenseParticipant.amount < 0
                )
            ),
            ExpenseParticipant.user_id != user.id,
            ExpenseParticipant.amount > 0,
        )
    )
    owes = db.scalar(
        select(func.coalesce(func.sum(ExpenseParticipant.amount).label("total"), 0))
        .join(Expense)
        .where(Expense.group_id == group_id)
        .where(ExpenseParticipant.user_id == user.id)
        .where(ExpenseParticipant.amount > 0)
    )

    payments_received = db.scalar(
        select(func.coalesce(func.sum(Payment.amount), 0))
        .where(Payment.group_id == group_id)
        .where(Payment.user_payee_id == user.id)
    )

    payments_from = db.scalar(
        select(func.coalesce(func.sum(Payment.amount), 0))
        .where(Payment.group_id == group_id)
        .where(Payment.user_payer_id == user.id)
    )

    owed -= payments_received
    owes -= payments_from

    balance = owed - owes

    debts = []
    for member in group.users:
        if member.id == user.id:
            continue

        debt_owed = db.scalar(
            select(func.coalesce(func.sum(ExpenseParticipant.amount), 0))
            .join(Expense)
            .filter(
                ExpenseParticipant.expense_id.in_(
                    select(ExpenseParticipant.expense_id)
                    .join(Expense)
                    .filter(
                        ExpenseParticipant.user_id == user.id,
                        Expense.group_id == group_id,
                        ExpenseParticipant.amount < 0,
                    )
                ),
                ExpenseParticipant.user_id == member.id,
                ExpenseParticipant.amount > 0,
            )
        )

        debt_owes = db.scalar(
            select(func.coalesce(func.sum(ExpenseParticipant.amount), 0))
            .join(Expense)
            .filter(
                ExpenseParticipant.expense_id.in_(
                    select(ExpenseParticipant.expense_id)
                    .join(Expense)
                    .filter(
                        ExpenseParticipant.user_id == member.id,
                        Expense.group_id == group_id,
                        ExpenseParticipant.amount < 0,
                    )
                ),
                ExpenseParticipant.user_id == user.id,
                ExpenseParticipant.amount > 0,
            )
        )

        payments_received = db.scalar(
            select(func.coalesce(func.sum(Payment.amount), 0))
            .where(Payment.group_id == group_id)
            .where(Payment.user_payee_id == user.id)
            .where(Payment.user_payer_id == member.id)
        )

        payments_from = db.scalar(
            select(func.coalesce(func.sum(Payment.amount), 0))
            .where(Payment.group_id == group_id)
            .where(Payment.user_payer_id == user.id)
            .where(Payment.user_payee_id == member.id)
        )
        debt_owed -= payments_received
        debt_owes -= payments_from

        debt_balance = debt_owed - debt_owes
        if debt_balance == 0:
            continue

        debts.append(Debt(user=member, amount=debt_balance))

    group = GroupView(
        id=group.id,
        name=group.name,
        description=group.description,
        members=group.users,
        expenses=group.expenses,
        owed=owed,
        owes=owes,
        balance=balance,
        debts=debts,
    )

    return group


def get_user_groups(db: Session, username: str) -> list[Group]:
    user = db.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user.groups
