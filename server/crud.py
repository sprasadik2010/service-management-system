from sqlalchemy.orm import Session
import models, schemas
from typing import List

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_service_request(db: Session, service_request: schemas.ServiceRequestCreate, user_id: int, screenshot_path: str = None):
    db_service_request = models.ServiceRequest(
        **service_request.dict(),
        user_id=user_id,
        screenshot_path=screenshot_path
    )
    db.add(db_service_request)
    
    # Create initial activity
    initial_activity = models.ServiceActivity(
        service_request=db_service_request,
        activity_type="created",
        description="Service request created",
        user_id=user_id
    )
    db.add(initial_activity)
    
    db.commit()
    db.refresh(db_service_request)
    return db_service_request

def get_service_requests(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ServiceRequest).offset(skip).limit(limit).all()

def get_service_request(db: Session, request_id: int):
    return db.query(models.ServiceRequest).filter(models.ServiceRequest.id == request_id).first()

def update_service_request(db: Session, request_id: int, update_data: schemas.ServiceRequestUpdate, user_id: int):
    db_request = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == request_id).first()
    if not db_request:
        return None
    
    update_dict = update_data.dict(exclude_unset=True)
    for field, value in update_dict.items():
        if hasattr(db_request, field) and getattr(db_request, field) != value:
            # Create activity for the change
            activity = models.ServiceActivity(
                service_request_id=request_id,
                activity_type=f"{field}_update",
                description=f"{field} changed from {getattr(db_request, field)} to {value}",
                user_id=user_id
            )
            db.add(activity)
            setattr(db_request, field, value)
    
    db.commit()
    db.refresh(db_request)
    return db_request

def get_service_activities(db: Session, request_id: int):
    return db.query(models.ServiceActivity).filter(
        models.ServiceActivity.service_request_id == request_id
    ).order_by(models.ServiceActivity.created_at.desc()).all()

def create_department(db: Session, department: schemas.DepartmentBase):
    db_department = models.Department(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

def get_departments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Department).offset(skip).limit(limit).all()