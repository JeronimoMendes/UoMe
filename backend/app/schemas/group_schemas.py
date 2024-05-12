from sqlmodel import SQLModel


class GroupCreate(SQLModel):
    name: str
    description: str = ""
