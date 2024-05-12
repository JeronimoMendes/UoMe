from fastapi import Depends
from fastapi.routing import APIRouter
from sqlmodel import Session

from app.core.db import get_db
from app.schemas.group_schema import GroupCreate, GroupResponse
from app.services import group_service
from app.services.auth_service import get_current_user

group_router = APIRouter()


@group_router.post("/groups", response_model=GroupResponse)
def create_group(group: GroupCreate, db: Session = Depends(get_db)):
    return group_service.create_group(db, group)


@group_router.get("/groups/{group_id}", response_model=GroupResponse)
def get_group(group_id: str, db: Session = Depends(get_db)):
    return group_service.get_group(db, group_id)


@group_router.delete("/groups/{group_id}")
def delete_group(group_id: str, db: Session = Depends(get_db)):
    group_service.delete_group(db, group_id)


@group_router.post("/groups/{group_id}/users/{username}")
def add_user_to_group(group_id: str, username: str, db: Session = Depends(get_db)):
    return group_service.add_user_to_group(db, group_id, username)


@group_router.delete("/groups/{group_id}/users/{username}")
def remove_user_from_group(group_id: str, username: str, db: Session = Depends(get_db)):
    return group_service.remove_user_from_group(db, group_id, username)


@group_router.get("/users/me/groups")
def get_user_groups(current_user: GroupResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    return group_service.get_user_groups(db, current_user.username)
