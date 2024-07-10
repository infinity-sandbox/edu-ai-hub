from typing import List 
from decouple import config
from logs.loggers.logger import logger_config
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
logger = logger_config(__name__)


class Settings(BaseSettings):
    logger.info("Loading configurations...")
    API_V1_STR: str = "/api/v1"
    JWT_SECRET_KEY: str = config("JWT_SECRET_KEY", cast=str)
    JWT_REFRESH_SECRET_KEY: str = config("JWT_REFRESH_SECRET_KEY", cast=str)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 # minutes
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7   # 7 days
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost:3000",
                                              "http://localhost:8000",
                                              "http://localhost"]
    PROJECT_NAME: str = "AIBOU"
    MONGO_CONNECTION_STRING: str = config("MONGO_CONNECTION_STRING", cast=str)
    OPENAI_API_KEY: str = config("OPENAI_API_KEY", cast=str)
    VDB_API_KEY: str = config("VDB_API_KEY", cast=str)
    VDB_URL: str = config("VDB_URL", cast=str)
    FRONTEND_API_URL: str = config("FRONTEND_API_URL", cast=str)
    BACKEND_API_URL: str = config("BACKEND_API_URL", cast=str)
    MY_EMAI: str = config("MY_EMAIL", cast=str)
    MY_EMAIL_PASSWORD: str = config("MY_EMAIL_PASSWORD", cast=str)
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        
settings = Settings()
