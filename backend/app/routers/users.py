from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/{user_id}/balances", response_model=List[schemas.Balance])
def get_user_balances(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    balances = []
    for group in user.groups:
        group_balances = {}
        for expense in group.expenses:
            if expense.paid_by not in group_balances:
                group_balances[expense.paid_by] = 0
            group_balances[expense.paid_by] += expense.amount
            for split in expense.splits:
                if split.user_id not in group_balances:
                    group_balances[split.user_id] = 0
                group_balances[split.user_id] -= split.amount
        if user_id in group_balances:
            balances.append(schemas.Balance(
                user_id=user_id,
                amount=group_balances[user_id],
                user_name=user.name
            ))
    return balances 