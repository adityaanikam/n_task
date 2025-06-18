from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from .. import models
from ..database import get_db

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

class ChatRequest(BaseModel):
    query: str
    user_id: int
    group_id: Optional[int] = None

class ChatResponse(BaseModel):
    answer: str
    context_used: str

@router.post("/ask", response_model=ChatResponse)
def ask_question(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Simple chatbot endpoint that provides expense-related responses.
    In a real implementation, this would integrate with an LLM.
    """
    user = db.query(models.User).filter(models.User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    query_lower = request.query.lower()
    
    # Simple keyword-based responses
    if any(word in query_lower for word in ["balance", "owe", "owes", "debt"]):
        if request.group_id:
            group = db.query(models.Group).filter(models.Group.id == request.group_id).first()
            if group:
                context = f"Showing balance information for group '{group.name}'"
                answer = f"You can check your balance in the '{group.name}' group using the Group Balances page. Navigate to Group Balances to see who owes what to whom."
            else:
                context = "Group not found"
                answer = "I couldn't find that group. Please check the group ID and try again."
        else:
            context = "General balance inquiry"
            answer = "You can check your balances across all groups in the 'My Balances' section. This shows your net balance in each group you're part of."
    
    elif any(word in query_lower for word in ["expense", "add", "create", "split"]):
        context = "Expense creation help"
        answer = "To add an expense, go to 'Add Expense' page. You can split expenses equally among group members or by custom percentages. Make sure to select the correct group and specify who paid for the expense."
    
    elif any(word in query_lower for word in ["group", "create group", "new group"]):
        context = "Group creation help"
        answer = "To create a new group, visit the 'Create Group' page. Add group members by entering their names and email addresses. You can add or remove members dynamically before creating the group."
    
    elif any(word in query_lower for word in ["help", "how", "what"]):
        context = "General help"
        answer = "I'm here to help with expense tracking! You can:\n- Create groups with friends\n- Add expenses and split them equally or by percentage\n- View balances to see who owes what\n- Track your balances across all groups\n\nWhat specific feature would you like help with?"
    
    else:
        context = "General response"
        answer = "I'm an expense tracking assistant. I can help you with creating groups, adding expenses, splitting costs, and checking balances. What would you like to know about expense management?"
    
    return ChatResponse(answer=answer, context_used=context) 