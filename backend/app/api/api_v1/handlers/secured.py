from fastapi import APIRouter, HTTPException, Header, status
from app.schemas.user_schema import UserAuth, UserOut, UserUpdate
import pymongo
from app.models.user_model import User
from fastapi.responses import JSONResponse
from app.services.user_service import UserService
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from app.schemas.auth_schema import TokenSchema, TokenPayload
from logs.loggers.logger import logger_config
logger = logger_config(__name__)
from app.models.user_model import User
import jwt
from bson import ObjectId
from fastapi import APIRouter, Query
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io, os
from Rhubarb_Lip_Sync_1_13_0_macOS.install import convert_audio_to_json
from app.services.openai_service import text_to_speech, speech_to_text

secured_router = APIRouter()

@secured_router.put('/profile/update', summary="Update user info by user_id", response_model=UserOut)
async def update_user(
    data: UserUpdate,
    authorization: str = Header(...),
    refresh_token: str = Header(...)
    ):
    try:
        user = await UserService.decode_token(authorization, refresh_token)
        return await UserService.update_user(user.user_id, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
@secured_router.get("/profile/view", response_model=UserUpdate)
async def get_user_profile(
    access_token: str = Query(..., alias="access_token"),
    refresh_token: str = Query(..., alias="refresh_token"),
):
    logger.info(f"Request token: {access_token} and {refresh_token}")
    user = await UserService.decode_token(access_token, refresh_token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@secured_router.post("/bot/class/first", summary="First interaction of bot class")
async def bot_payload_first(selectedClass: str):
    # Define paths for audio files
    # NOTE: update with google drive path for the sound
    wav_file_path = "Rhubarb_Lip_Sync_1_13_0_macOS/audio/new_file.wav"  # Update with your path
    webm_file_path = "Rhubarb_Lip_Sync_1_13_0_macOS/audio/new_file.webm"
    takling_text = "Hello Mr. Abel, how are you doing today? I admire your work with miki. My name is ai bou."
    # Generate audio file
    text_to_speech(takling_text, webm_file_path, wav_file_path)
    # output_json_path="Rhubarb_Lip_Sync_1_13_0_macOS/audio/new_file.json"
    json_content = convert_audio_to_json(wav_file_path)
    # audio_path: str, 
    #                       output_json_path: str = "", 
    #                       is_json: bool = False
    # Create JSON data (replace with your logic to calculate actual duration)
    json_data = json_content
    
    # Serve the audio file
    audio_file = open(wav_file_path, "rb")
    audio_response = StreamingResponse(audio_file, media_type="audio/wav")

    return {
        "audio_url": wav_file_path,  # URL to access the audio file
        "json_data": json_data,
        "question": "What is English grammar?"
    }
