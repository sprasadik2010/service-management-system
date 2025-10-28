from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from enum import Enum

class PriorityLevel(str, Enum):
    low = "low"
    normal = "normal"
    important = "important"
    urgent = "urgent"

class StatusLevel(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    closed = "closed"

class UserRole(str, Enum):
    user = "user"
    department = "department"
    management = "management"

class UserBase(BaseModel):
    email: str
    name: str
    role: UserRole

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None

class Department(DepartmentBase):
    id: int
    
    class Config:
        from_attributes = True

class ServiceRequestBase(BaseModel):
    title: str
    description: str
    department_id: int

class ServiceRequestCreate(ServiceRequestBase):
    pass

class ServiceRequestUpdate(BaseModel):
    priority: Optional[PriorityLevel] = None
    status: Optional[StatusLevel] = None
    department_id: Optional[int] = None

class ServiceRequest(ServiceRequestBase):
    id: int
    screenshot_path: Optional[str]
    priority: PriorityLevel
    status: StatusLevel
    user_id: int
    created_at: datetime
    updated_at: datetime
    user: User
    department: Department
    
    class Config:
        from_attributes = True

class ServiceActivityBase(BaseModel):
    activity_type: str
    description: str

class ServiceActivity(ServiceActivityBase):
    id: int
    service_request_id: int
    user_id: int
    created_at: datetime
    user: User
    
    class Config:
        from_attributes = True

class ServiceRequestWithActivities(ServiceRequest):
    activities: List[ServiceActivity] = []