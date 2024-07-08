import os, sys
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from utils.console.banner import run_banner
from app.models.authorization import (Login, Token, TokenData)
from hashing import Hash
from fastapi import FastAPI, HTTPException, Depends, Request, status
from mongoserver.oauth import get_current_user
from jwttoken import create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

# FastAPI App
app = FastAPI(title='aibou', debug=False)

# Add middleware for handling Cross Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

run_banner()

# domain app router
@app.get("/")
async def serve_frontend():
    return {'data':'Hello World'}

@app.post('/register')
def create_user(request:User):
    hashed_pass = Hash.bcrypt(request.password)
    user_object = dict(request)
    user_object["password"] = hashed_pass
    user_id = db["users"].insert(user_object)
    return {"res":"created"}

@app.post('/login')
def login(request:OAuth2PasswordRequestForm = Depends()):
    user = db["users"].find_one({"username":request.username})
    if not user:
        raiseHTTPException(status_code=status.HTTP_404_NOT_FOUND)
    if not Hash.verify(user["password"],request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    access_token = create_access_token(data={"sub": user["username"] })
    return {"access_token": access_token, "token_type": "bearer"}

