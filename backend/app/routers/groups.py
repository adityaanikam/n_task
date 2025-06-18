from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/groups",
    tags=["groups"]
)

@router.get("/", response_model=List[schemas.Group])
def get_groups(db: Session = Depends(get_db)):
    groups = db.query(models.Group).all()
    return groups

@router.post("/", response_model=schemas.Group)
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    db_group = models.Group(name=group.name, description=group.description)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    # Add users
    for user_data in group.users:
        db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
        if not db_user:
            db_user = models.User(name=user_data.name, email=user_data.email, hashed_password="")
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
        db_group.members.append(db_user)
    db.commit()
    db.refresh(db_group)
    return db_group

@router.get("/{group_id}", response_model=schemas.Group)
def get_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return group

@router.get("/{group_id}/balances", response_model=List[schemas.Balance])
def get_group_balances(group_id: int, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    
    balances = {}
    for expense in group.expenses:
        # Add amount for the person who paid
        if expense.paid_by not in balances:
            balances[expense.paid_by] = 0
        balances[expense.paid_by] += expense.amount
        
        # Subtract amounts for people who owe
        for split in expense.splits:
            if split.user_id not in balances:
                balances[split.user_id] = 0
            balances[split.user_id] -= split.amount
    
    # Convert to list of Balance objects
    result = []
    for user_id, amount in balances.items():
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user:
            result.append(schemas.Balance(
                user_id=user_id,
                amount=amount,
                user_name=user.name
            ))
    
    return result 