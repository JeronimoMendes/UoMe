from fastapi import Depends
from fastapi.routing import APIRouter
from sqlmodel import Session

from app.auth import auth_service
from app.auth.auth_schema import CreateUser, UserResponse
from app.core.db import get_db

auth_router = APIRouter()


@auth_router.post("/register", response_model=UserResponse)
def register(user: CreateUser, db: Session = Depends(get_db)):
    return auth_service.create_user(db, user)
