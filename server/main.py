from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
import shutil

from database import SessionLocal, engine
import models, schemas, crud

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Service Request Management System")


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# File upload directory
UPLOAD_DIR = "uploads/screenshots"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@app.post("/service-requests/", response_model=schemas.ServiceRequest)
async def create_service_request(
    title: str = Form(...),
    description: str = Form(...),
    department_id: int = Form(...),
    user_id: int = Form(...),
    screenshot: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    screenshot_path = None
    if screenshot:
        file_path = f"{UPLOAD_DIR}/{screenshot.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(screenshot.file, buffer)
        screenshot_path = file_path
    
    service_request = schemas.ServiceRequestCreate(
        title=title,
        description=description,
        department_id=department_id
    )
    
    return crud.create_service_request(
        db=db, 
        service_request=service_request, 
        user_id=user_id,
        screenshot_path=screenshot_path
    )

@app.get("/service-requests/", response_model=List[schemas.ServiceRequest])
def read_service_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_service_requests(db, skip=skip, limit=limit)

@app.get("/service-requests/{request_id}", response_model=schemas.ServiceRequestWithActivities)
def read_service_request(request_id: int, db: Session = Depends(get_db)):
    db_request = crud.get_service_request(db, request_id=request_id)
    if db_request is None:
        raise HTTPException(status_code=404, detail="Service request not found")
    return db_request

@app.patch("/service-requests/{request_id}", response_model=schemas.ServiceRequest)
def update_service_request(
    request_id: int, 
    update_data: schemas.ServiceRequestUpdate,
    user_id: int,
    db: Session = Depends(get_db)
):
    return crud.update_service_request(db, request_id, update_data, user_id)

@app.get("/service-requests/{request_id}/activities", response_model=List[schemas.ServiceActivity])
def read_service_activities(request_id: int, db: Session = Depends(get_db)):
    return crud.get_service_activities(db, request_id)

@app.post("/departments/", response_model=schemas.Department)
def create_department(department: schemas.DepartmentBase, db: Session = Depends(get_db)):
    return crud.create_department(db=db, department=department)

@app.get("/departments/", response_model=List[schemas.Department])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_departments(db, skip=skip, limit=limit)