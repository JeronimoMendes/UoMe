import datetime
import os
import uuid

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from jose.exceptions import JWTError
from passlib.context import CryptContext
from sqlmodel import Session, select

from app.core.db import get_db
from app.models import User
from app.schemas.auth_schema import CreateUser, UserResponse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
EXPIRATION_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def create_user(db: Session, user: CreateUser) -> User:
    # check if user with the same email or username already exists
    query = select(User).where(User.email == user.email)
    if db.exec(query).first():
        raise Exception("Email already exists")
    query = select(User).where(User.username == user.username)
    if db.exec(query).first():
        raise Exception("Username already exists")

    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        id=uuid.uuid4(),
        username=user.username,
        email=user.email,
        password=hashed_password,
    )
    db.add(db_user)
    return db_user


def delete_user(db: Session, username: str):
    query = select(User).where(User.username == username)
    user = db.exec(query).first()
    if not user:
        raise Exception("User not found")
    db.delete(user)


def authenticate_user(db: Session, email: str, password: str) -> bool | User:
    query = select(User).where(User.email == email)
    user = db.exec(query).first()
    if not user:
        return False
    if not pwd_context.verify(password, user.password):
        return False
    return user


def create_access_token(user: User):
    expire = datetime.datetime.now() + datetime.timedelta(minutes=EXPIRATION_MINUTES)
    public_user = UserResponse.model_validate(user.model_dump(mode="json"))
    to_encode = {"exp": expire, "sub": user.email, "user": public_user.model_dump(mode="json")}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt


# dependency that given a bearer token, returns the user
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise credentials_exception
    return user
