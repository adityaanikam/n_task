# Splitwise Clone – Neurix Full-Stack SDE Intern Assignment

A complete expense tracking application built with FastAPI, PostgreSQL, React, and TailwindCSS.

## ✅ Status: COMPLETE & WORKING
All assignment requirements implemented and tested successfully!

## 🚀 Features
- ✅ **Group Management**: Create groups with multiple users  
- ✅ **Expense Tracking**: Add expenses with equal or percentage splits
- ✅ **Balance Calculation**: Automatic balance tracking showing who owes whom
- ✅ **User Dashboard**: View personal balances across all groups
- ✅ **Modern UI**: Responsive design with TailwindCSS and Heroicons
- ✅ **AI Chatbot**: Natural language queries about expenses (bonus feature)
- ✅ **RESTful API**: FastAPI with automatic OpenAPI documentation

## 🛠 Tech Stack
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Python 3.11
- **Frontend**: React 18, TypeScript, TailwindCSS, Vite
- **Database**: PostgreSQL 15 with persistent volumes
- **DevOps**: Docker Compose for full-stack deployment

## Project Structure
```
neurix_intern/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Setup & Run (Docker Compose)

1. **Clone the repo**
   ```bash
   git clone https://github.com/adityaanikam/n_task.git
   ```

2. **Set up environment variables**
   Create a `.env` file in the **backend** directory with the following variables:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expense_tracker
   SECRET_KEY=your_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   GOOGLE_API_KEY=your_google_api_key_here
   ```

3. **Run everything with Docker Compose:**
   ```bash
   docker-compose up --build
   ```
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5173
   - PostgreSQL: localhost:5432 (user: postgres, pass: postgres, db: expense_tracker)

4. **API Docs:**
   - Swagger: http://localhost:8000/docs

## Working Demo Video
Check out the working demo video showcasing all features:
https://drive.google.com/file/d/1aEhvNOWOSCjIZsX_5evzG7bKz5bCZPb5/view?usp=sharing

## API Endpoints

### Group Management
- `POST /groups` – Create group with name, description, and users
- `GET /groups/{group_id}` – Get group details

### Expense Management
- `POST /groups/{group_id}/expenses` – Add expense (equal/percentage split)
- `GET /groups/{group_id}/expenses` – List group expenses

### Balance Tracking
- `GET /groups/{group_id}/balances` – See who owes whom
- `GET /users/{user_id}/balances` – See all balances for a user

### Chatbot (Bonus)
- `POST /chat/ask` – Ask natural language questions about expenses

## Assignment Compliance Checklist
- [x] Group creation with users
- [x] Add expenses (equal/percentage split)
- [x] Track balances (who owes whom)
- [x] View personal balances
- [x] PostgreSQL for persistence
- [x] Modern React + Tailwind UI
- [x] REST API (FastAPI)
- [x] Docker Compose for full stack
- [x] API docs (Swagger)
- [x] Bonus: LLM-powered chatbot

## Assumptions
- No authentication required
- No payment/settlement functionality
- User emails are unique

## How to Test
- Create a group with users
- Add expenses (try both equal and percentage splits)
- View group and personal balances
- Use the chatbot for queries

---

### any questions mail me at adityaanikam9502@gmail.com  
