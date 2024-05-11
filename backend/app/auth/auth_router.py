from fastapi import Depends
from fastapi.exceptions import HTTPException
from fastapi.routing import APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session

from app.auth import auth_service
from app.auth.auth_schema import CreateUser, UserResponse
from app.core.db import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

auth_router = APIRouter()


@auth_router.post("/register", response_model=UserResponse)
def register(user: CreateUser, db: Session = Depends(get_db)):
    return auth_service.create_user(db, user)


@auth_router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = auth_service.create_access_token(user.email)

    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.delete("/users/me")
def delete_user(
    current_user: UserResponse = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db),
):
    auth_service.delete_user(db, current_user.username)
    return {"message": "User deleted"}


@auth_router.get("/users/me", response_model=UserResponse)
def get_user(current_user: UserResponse = Depends(auth_service.get_current_user)):
    return current_user
