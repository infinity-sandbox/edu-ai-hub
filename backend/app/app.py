import os, sys
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from utils.console.banner import run_banner
from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
run_banner()


app.get("/")
async def hello():
    return {"message": "Hello World"}
