import os
import sys
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from utils.console.banner import run_banner
from app.models.authorization import {Login, 
                              Token, 
                              TokenData}

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
