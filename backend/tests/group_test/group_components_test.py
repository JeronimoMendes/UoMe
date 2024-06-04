import pytest  # noqa
from fastapi import HTTPException
from sqlmodel import select

from app.models import User
from app.schemas.group_schemas import GroupCreate
from app.services.group_service import (
    add_user_to_group,
    create_group,
    delete_group,
    get_group,
    get_user_groups,
    remove_user_from_group,
)
from app.services.expense_service import create_expense
from app.schemas.expenses_schema import ExpenseCreate, ExpenseParticipantCreate


def test_get_group(db, joedoe):
    cristiano = db.exec(select(User).where(User.username == "cristianoronaldo")).first()
    group = get_group(db, group_id="a953d022-4895-4327-bd44-82a41b2a9725", user=joedoe)
    assert group is not None
    assert group.name == "Joe's personal group"
    assert group.description == "Joe's personal group"

    group = get_group(db, group_id="c018fc08-0873-4355-bc95-40a07f146cf7", user=joedoe)
    assert group is not None
    assert group.name == "General group"
    assert group.description == "Group that includes all users"
    assert group.balance == 0
    assert group.expenses == []
    assert group.owed == 0
    assert group.owes == 0

    expense = ExpenseCreate(
        amount=100,
        description="test expense",
        group_id="c018fc08-0873-4355-bc95-40a07f146cf7",
        date="2021-10-10",
        type="test",
        participants=[
            ExpenseParticipantCreate(user_id=joedoe.id, amount=-50),
            ExpenseParticipantCreate(user_id=cristiano.id, amount=50),
        ],
    )
    create_expense(db, expense, joedoe)
    group = get_group(db, group_id="c018fc08-0873-4355-bc95-40a07f146cf7", user=joedoe)
    assert group.balance == 50
    assert group.owed == 50
    assert group.owes == 0

    group = get_group(db, group_id="c018fc08-0873-4355-bc95-40a07f146cf7", user=cristiano)
    assert group.balance == -50
    assert group.owed == 0
    assert group.owes == 50

    expense = ExpenseCreate(
        amount=200,
        description="test expense",
        group_id="c018fc08-0873-4355-bc95-40a07f146cf7",
        date="2021-10-10",
        type="test",
        participants=[
            ExpenseParticipantCreate(user_id=joedoe.id, amount=100),
            ExpenseParticipantCreate(user_id=cristiano.id, amount=-100),
        ],
    )
    create_expense(db, expense, joedoe)

    group = get_group(db, group_id="c018fc08-0873-4355-bc95-40a07f146cf7", user=joedoe)
    assert group.balance == -50
    assert group.owed == 50
    assert group.owes == 100

    group = get_group(db, group_id="c018fc08-0873-4355-bc95-40a07f146cf7", user=cristiano)
    assert group.balance == 50
    assert group.owed == 100
    assert group.owes == 50

    with pytest.raises(HTTPException):
        group = get_group(db, group_id="c018fc08-0873-4355-bc95-40a07f146cf8", user=joedoe)


def test_create_group(db, user):
    group = GroupCreate(name="test group", description="test group description")
    new_group = create_group(db, group, user.username)
    assert new_group.id is not None
    assert new_group.name == "test group"
    assert new_group.description == "test group description"

    new_group = get_group(db, group_id=new_group.id, user=user)
    assert new_group is not None
    assert new_group.name == "test group"
    assert new_group.description == "test group description"
    assert new_group.balance == 0
    assert new_group.expenses == []
    assert new_group.owed == 0
    assert new_group.owes == 0

    # check if the user who created the group is a member of the group
    group_members_ids = [member.id for member in new_group.members]
    assert user.id in group_members_ids

    # unexistent user
    with pytest.raises(HTTPException):
        create_group(db, group, username="unexistent")


def test_delete_group(db, joedoe):
    with pytest.raises(HTTPException):
        delete_group(db, group_id="c018fc08-0873-4355-bc95-40a07f146cf8")

    delete_group(db, group_id="a953d022-4895-4327-bd44-82a41b2a9725")

    with pytest.raises(HTTPException):
        get_group(db, group_id="a953d022-4895-4327-bd44-82a41b2a9725", user=joedoe)


def test_add_user_to_group(db, user):
    add_user_to_group(db, email=user.email, group_id="a953d022-4895-4327-bd44-82a41b2a9725")
    group = get_group(db, group_id="a953d022-4895-4327-bd44-82a41b2a9725", user=user)
    group_members_ids = [member.id for member in group.members]
    assert user.id in group_members_ids

    # user already in group
    with pytest.raises(HTTPException):
        add_user_to_group(db, email="joedoe@gmail.com", group_id="c018fc08-0873-4355-bc95-40a07f146cf7")

    # unexistent user
    with pytest.raises(HTTPException):
        add_user_to_group(db, email="unexistent@gmail.com", group_id="a953d022-4895-4327-bd44-82a41b2a9725")

    # unexistent group
    with pytest.raises(HTTPException):
        add_user_to_group(db, email="joedoe@gmail.com", group_id="b953d022-4895-4327-bd44-82a41b2a9825")


def test_remove_user_from_group(db):
    user = db.exec(select(User).where(User.username == "louishamilton")).first()
    remove_user_from_group(db, email="joedoe@gmail.com", group_id="c018fc08-0873-4355-bc95-40a07f146cf7")
    group = get_group(db, group_id="c018fc08-0873-4355-bc95-40a07f146cf7", user=user)
    user = db.exec(select(User).where(User.username == "joedoe")).first()
    assert user not in group.members

    # user not in group
    with pytest.raises(HTTPException):
        remove_user_from_group(db, email="joedoe@gmail.com", group_id="c018fc08-0873-4355-bc95-40a07f146cf7")

    # unexistent user
    with pytest.raises(HTTPException):
        remove_user_from_group(db, email="unexistent@uome.com", group_id="c018fc08-0873-4355-bc95-40a07f146cf7")

    # unexistent group
    with pytest.raises(HTTPException):
        remove_user_from_group(db, email="joedoe@gmail.com", group_id="b953d022-4895-4327-bd44-82a41b2a9825")


def test_get_user_groups(db):
    user_groups = get_user_groups(db, username="joedoe")
    assert len(user_groups) == 2
    assert user_groups[0].name == "Joe's personal group"
    assert user_groups[1].name == "General group"

    # unexistent user
    with pytest.raises(HTTPException):
        get_user_groups(db, username="unexistent")
