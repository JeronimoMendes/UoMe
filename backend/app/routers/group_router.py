from uuid import UUID

from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter
from sqlmodel import Session

from app.core.db import get_db
from app.models import Group, User
from app.schemas.group_schemas import GroupCreate, GroupView
from app.services import group_service
from app.services.auth_service import get_current_user

group_router = APIRouter()


@group_router.post("/groups", response_model=Group)
def create_group(group: GroupCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return group_service.create_group(db, group, user.username)


@group_router.get("/groups/{group_id}", response_model=GroupView)
def get_group(group_id: UUID, db: Session = Depends(get_db)):
    return group_service.get_group(db, group_id)


@group_router.delete("/groups/{group_id}")
def delete_group(group_id: UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # if user does not belong to the group, raise 403
    group = db.get(Group, group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    if group not in user.groups:
        raise HTTPException(status_code=403, detail="User does not belong to the group")
    group_service.delete_group(db, group_id)
    return {"message": "Group deleted"}


@group_router.post("/groups/{group_id}/users/{username}")
def add_user_to_group(
    group_id: str, username: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    # if user does not belong to the group, raise 403
    group = db.get(Group, group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    if group not in user.groups:
        raise HTTPException(status_code=403, detail="User does not belong to the group")
    group_service.add_user_to_group(db, username, group_id)
    return {"message": "User added to the group"}


@group_router.delete("/groups/{group_id}/users/{username}")
def remove_user_from_group(
    group_id: str, username: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    group = db.get(Group, group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    if group not in user.groups:
        raise HTTPException(status_code=403, detail="User does not belong to the group")
    group_service.remove_user_from_group(db, username, group_id)
    return {"message": "User removed from the group"}


@group_router.get("/users/me/groups", response_model=list[Group])
def get_user_groups(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return group_service.get_user_groups(db, current_user.username)
