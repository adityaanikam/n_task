from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/groups/{group_id}/expenses",
    tags=["expenses"]
)

@router.post("/", response_model=schemas.Expense)
def create_expense(group_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    # Validate group
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    # Validate paid_by
    payer = db.query(models.User).filter(models.User.id == expense.paid_by).first()
    if not payer:
        raise HTTPException(status_code=404, detail="Payer not found")
    # Calculate splits
    splits = []
    if expense.split_type == "equal":
        num_members = len(group.members)
        if num_members == 0:
            raise HTTPException(status_code=400, detail="No group members to split expense")
        split_amount = round(expense.amount / num_members, 2)
        for member in group.members:
            splits.append({"user_id": member.id, "amount": split_amount, "percentage": None})
    elif expense.split_type == "percentage":
        total_percentage = sum([split.percentage or 0 for split in expense.splits])
        if total_percentage != 100:
            raise HTTPException(status_code=400, detail="Percentages must sum to 100")
        for split in expense.splits:
            amount = round(expense.amount * (split.percentage or 0) / 100, 2)
            splits.append({"user_id": split.user_id, "amount": amount, "percentage": split.percentage})
    else:
        raise HTTPException(status_code=400, detail="Invalid split_type")
    # Create expense
    db_expense = models.Expense(
        amount=expense.amount,
        description=expense.description,
        group_id=group_id,
        paid_by=expense.paid_by,
        split_type=expense.split_type
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    # Add splits
    for split in splits:
        db_split = models.ExpenseSplit(
            expense_id=db_expense.id,
            user_id=split["user_id"],
            amount=split["amount"],
            percentage=split["percentage"]
        )
        db.add(db_split)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/", response_model=List[schemas.Expense])
def get_group_expenses(group_id: int, db: Session = Depends(get_db)):
    expenses = db.query(models.Expense).filter(models.Expense.group_id == group_id).all()
    return expenses 