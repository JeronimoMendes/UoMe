from uuid import UUID

from fastapi.exceptions import HTTPException
from sqlmodel import select

from app.core.db import Session
from app.models import Group, User, UserGroup
from app.schemas.group_schemas import GroupCreate, GroupView


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


def add_user_to_group(db: Session, username: str, group_id: UUID) -> None:
    user = db.exec(select(User).where(User.username == username)).first()
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


def remove_user_from_group(db: Session, username: str, group_id: UUID) -> None:
    user = db.exec(select(User).where(User.username == username)).first()
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


def get_group(db: Session, group_id: UUID) -> GroupView:
    group = db.get(Group, group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")

    group = GroupView(
        id=group.id,
        name=group.name,
        description=group.description,
        members=group.users,
        expenses=group.expenses,
    )

    return group


def get_user_groups(db: Session, username: str) -> list[Group]:
    user = db.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user.groups
