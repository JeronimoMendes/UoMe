from uuid import UUID

from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter

import app.services.expense_service as expense_service
from app.core.db import Session, get_db
from app.models import User, Group
from app.schemas.expenses_schema import ExpenseCreate, ExpenseResponse
from app.services.auth_service import get_current_user
from sqlmodel import select

expense_router = APIRouter()


@expense_router.post("/expenses", response_model=ExpenseResponse)
async def create_expense(expense: ExpenseCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expense = expense_service.create_expense(db, expense, user)
    db.commit()
    # response = ExpenseResponse(**expense.model_dump(), participants=expense.participants)
    return expense


@expense_router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expense = expense_service.get_expense(db, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    expense_participants_ids = [participant.user_id for participant in expense.participants]
    if user.id not in expense_participants_ids:
        raise HTTPException(status_code=403, detail="User does not belong to expense")
    expense_service.delete_expense(db, expense_id)
    return {"message": "Expense deleted"}


@expense_router.get("/expenses/{expense_id}", response_model=ExpenseResponse)
async def get_expense(expense_id: UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expense = expense_service.get_expense(db, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    if expense.group not in user.groups:
        raise HTTPException(status_code=404, detail="Expense not found")

    return expense


@expense_router.get("/users/me/expenses", response_model=list[ExpenseResponse])
async def get_user_expenses(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return expense_service.get_user_expenses(db, user.id)


@expense_router.get("/groups/{group_id}/expenses", response_model=list[ExpenseResponse])
async def get_group_expenses(group_id: UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    group = db.exec(select(Group).where(Group.id == group_id)).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    if group_id not in [group.id for group in user.groups]:
        raise HTTPException(status_code=403, detail="User does not belong to the group")

    return expense_service.get_group_expenses(db, group_id)
