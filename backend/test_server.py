#!/usr/bin/env python3

try:
    import sys
    print(f"Python version: {sys.version}")
    
    # Test imports
    print("Testing imports...")
    import fastapi
    print(f"✓ FastAPI version: {fastapi.__version__}")
    
    import uvicorn
    print(f"✓ Uvicorn available")
    
    import sqlalchemy
    print(f"✓ SQLAlchemy version: {sqlalchemy.__version__}")
    
    # Test database connection
    print("Testing database...")
    from app.database import engine, Base
    print("✓ Database imports successful")
    
    # Test main app
    print("Testing main app...")
    from app.main import app
    print("✓ Main app imports successful")
    
    print("\nAll imports successful! You can run:")
    print("uvicorn app.main:app --reload")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please install missing packages:")
    print("pip install fastapi uvicorn sqlalchemy python-dotenv pydantic")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("Please check your configuration") 