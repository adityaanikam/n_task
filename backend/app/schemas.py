from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None

class GroupCreate(GroupBase):
    users: List[UserCreate]

class Group(GroupBase):
    id: int
    members: List[User] = []

    class Config:
        from_attributes = True

class ExpenseSplitBase(BaseModel):
    user_id: int
    amount: Optional[float] = None
    percentage: Optional[float] = None

class ExpenseSplitCreate(ExpenseSplitBase):
    pass

class ExpenseSplit(ExpenseSplitBase):
    id: int
    expense_id: int

    class Config:
        from_attributes = True

class ExpenseCreateBase(BaseModel):
    amount: float
    description: str
    paid_by: int
    split_type: str

class ExpenseCreate(ExpenseCreateBase):
    splits: List[ExpenseSplitCreate]

class ExpenseBase(BaseModel):
    amount: float
    description: str
    group_id: int
    paid_by: int
    split_type: str

class Expense(ExpenseBase):
    id: int
    splits: List[ExpenseSplit] = []

    class Config:
        from_attributes = True

class Balance(BaseModel):
    user_id: int
    amount: float
    user_name: str 