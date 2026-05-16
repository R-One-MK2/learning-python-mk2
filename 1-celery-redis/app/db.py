import os
from datetime import datetime
from enum import StrEnum
from typing import Optional

from sqlalchemy import DateTime, Integer, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped, mapped_column, sessionmaker

# 1. Get Database URL from environment
# Use psycopg3 (sync) - installed as psycopg[binary] in dependencies
# The +psycopg part explicitly tells SQLAlchemy to use psycopg3 driver
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://user:password@localhost:5432/tasks_db",
)

print(f"[DEBUG] Using DATABASE_URL: {DATABASE_URL}")

# 2. Create Engine (Connection Pool)
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

# 3. Create Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Create base class for models
Base = declarative_base()


# 5. Define task model
# 2. String Enum for Task Status
class TaskStatus(StrEnum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


# 3. Clean Model Definition
class Task(Base):
    __tablename__ = "Tasks"

    # Mapped[type] gives strict autocomplete and satisfies Pylance perfectly
    id: Mapped[str] = mapped_column(String, primary_key=True)
    status: Mapped[TaskStatus] = mapped_column(String, default=TaskStatus.PENDING)
    x: Mapped[int] = mapped_column(Integer)
    y: Mapped[int] = mapped_column(Integer)

    # Optional[type] automatically maps to nullable=True under the hood
    result: Mapped[Optional[int]] = mapped_column(Integer)
    error: Mapped[Optional[str]] = mapped_column(Text)

    # Use datetime.now(timezone.utc) over utcnow (utcnow is deprecated in Python 3.12+)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)


# 6. Create all tables
Base.metadata.create_all(bind=engine)


# 7. Helper function to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
