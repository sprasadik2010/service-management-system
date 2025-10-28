from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class PriorityLevel(enum.Enum):
    low = "low"
    normal = "normal"
    important = "important"
    urgent = "urgent"

class StatusLevel(enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    closed = "closed"

class UserRole(enum.Enum):
    user = "user"
    department = "department"
    management = "management"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.user)
    created_at = Column(DateTime, default=datetime.utcnow)

class ServiceRequest(Base):
    __tablename__ = "service_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    screenshot_path = Column(String)  # Store file path
    priority = Column(Enum(PriorityLevel), default=PriorityLevel.normal)
    status = Column(Enum(StatusLevel), default=StatusLevel.pending)
    user_id = Column(Integer, ForeignKey("users.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User")
    department = relationship("Department")
    activities = relationship("ServiceActivity", back_populates="service_request")

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)

class ServiceActivity(Base):
    __tablename__ = "service_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    service_request_id = Column(Integer, ForeignKey("service_requests.id"))
    activity_type = Column(String)  # e.g., "status_change", "priority_update", "note"
    description = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    service_request = relationship("ServiceRequest", back_populates="activities")
    user = relationship("User")