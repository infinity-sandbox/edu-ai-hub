import os, sys
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from utils.console.banner import run_banner
from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from logs.loggers.logger import logger_config
logger = logger_config(__name__)
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.user_model import User
from app.api.api_v1.router import router
from fastapi.responses import JSONResponse

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

run_banner()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static directory
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def serve_frontend():
    return JSONResponse(
                content={
                    "message": "aibou backend api. welcome to the jungle!",
                }
            )

@app.on_event("startup")
async def app_init():
    """
        initialize crucial application services
    """
    
    db_client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING).aibou
    # TODO: add weaviate connection here
    
    await init_beanie(
        database=db_client,
        document_models= [
            User
            # TODO: add bot model schema here
        ]
    )
    
app.include_router(router, prefix=settings.API_V1_STR)
