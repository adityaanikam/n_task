from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import groups, expenses, users, chat
import time

app = FastAPI(title="Expense Tracker API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(groups.router)
app.include_router(expenses.router)
app.include_router(users.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Expense Tracker API"}

@app.get("/test")
def test_endpoint():
    """Test endpoint to check if the API is working"""
    return {"status": "ok", "message": "API is working correctly"}

@app.on_event("startup")
async def startup_event():
    """Create database tables on startup with retries"""
    from .database import engine
    from . import models
    
    max_retries = 5
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            print(f"Attempt {attempt + 1}: Creating database tables...")
            models.Base.metadata.create_all(bind=engine)
            print("✅ Database tables created successfully")
            return
        except Exception as e:
            print(f"⚠️  Database connection failed (attempt {attempt + 1}): {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print("❌ Failed to connect to database after all retries")
                print("Server will start but database operations will fail")
                print("Please check your DATABASE_URL configuration") 