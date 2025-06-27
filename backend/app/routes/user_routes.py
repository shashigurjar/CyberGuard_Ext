from fastapi import APIRouter, Request, Response, status, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.schemas.user_schema import User
from mongoengine.errors import NotUniqueError
from werkzeug.security import generate_password_hash, check_password_hash
from app.middlewares.session_auth import session_auth_required

router = APIRouter()

class SignupModel(BaseModel):
    name: str
    email: str
    password: str

class LoginModel(BaseModel):
    email: str
    password: str

@router.post("/auth/signup")
def signup(user: SignupModel, request: Request, response: Response):
    try:
        hashed_pw = generate_password_hash(user.password)
        new_user = User(name=user.name, email=user.email, password=hashed_pw)
        new_user.save()
        request.session["user_id"] = str(new_user.id)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={"message": "User Created"})
    except NotUniqueError:
        return JSONResponse(status_code=400, content={"error": "Email already exists"})

@router.post("/auth/login")
def login(data: LoginModel, request: Request):
    user = User.objects(email=data.email).first()
    if not user:
        return JSONResponse(status_code=400, content={"error": "User not found"})
    if not check_password_hash(user.password, data.password):
        return JSONResponse(status_code=401, content={"error": "Invalid password"})

    request.session["user_id"] = str(user.id)
    return JSONResponse(status_code=201, content={"message": "User LoggedIn"})

@router.post("/auth/logout")
def logout(request: Request, response: Response):
    request.session.clear()
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("session")
    return response

@router.get("/auth/dashboard")
def dashboard(request: Request, _: None = Depends(session_auth_required)):
    return {"loggedIn": True}
