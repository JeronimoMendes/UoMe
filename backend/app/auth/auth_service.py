import uuid

from passlib.context import CryptContext
from sqlmodel import Session, select

from app.auth.auth_schema import CreateUser, User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user(db: Session, user: CreateUser):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(id=uuid.uuid4(), username=user.name, email=user.email, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, username: str, password: str) -> bool | User:
    query = select(User).where(User.username == username)
    user = db.exec(query).first()
    if not user:
        return False
    if not pwd_context.verify(password, user.password):
        return False
    return user
