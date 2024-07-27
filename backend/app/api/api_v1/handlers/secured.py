from fastapi import APIRouter, HTTPException, Header, status, Query
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
import jwt
from bson import ObjectId
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io, os
from Rhubarb_Lip_Sync_1_13_0_macOS.install import convert_audio_to_json
from app.services.openai_service import OpenAIService
from app.schemas.bot_schema import SubjectSelection, BotFirstResponse
import shutil

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

@secured_router.post("/bot/class/interaction/first", summary="First interaction of bot class", response_model=BotFirstResponse)
async def bot_payload_first(subject: SubjectSelection, 
                            authorization: str = Header(...),
                            refresh_token: str = Header(...)
                            ):
    try:
        user = await UserService.decode_token(authorization, refresh_token)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    try:
        if not subject.selectedClass:
            raise HTTPException(status_code=400, detail="selectedClass query parameter is required")
        logger.info(f"selectedClass: {subject.selectedClass}")
        output_voice_text = await OpenAIService.introduction("app/prompts/tx/intro.txt", user.username, subject.selectedClass)
        formatted_question = await UserService.get_formated_question(subject.selectedClass)
        wav_file_path, webm_file_path = await UserService.audio_path_generator(user.user_id)
        logger.debug(f"output voice assistant text  : {output_voice_text}\nformatted question: {formatted_question}\nwav file path: {wav_file_path}, webm file path: {webm_file_path}\n")
        # Generate audio file
        OpenAIService.text_to_speech(output_voice_text, webm_file_path, wav_file_path)
        json_content = convert_audio_to_json(wav_file_path)

        return BotFirstResponse(
            audio_url=wav_file_path,
            json_data=json_content,
            question=formatted_question
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))























# @secured_router.post("/upload-audio", summary="Upload audio file")
# async def upload_audio(file: UploadFile = File(...)):
#     try:
#         # Get the next counter value
#         counter = get_next_counter_value() + 1
#         # Update the counter file
#         update_counter_file(counter)
        
#         # Create file name
#         file_name = f"recorded_{counter}.wav"
#         file_location = f"static/{file_name}"
        
#         with open(file_location, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#         return JSONResponse(content={"info": "File uploaded successfully", "file_url": file_location})
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # File to keep track of the counter
# COUNTER_FILE = "static/counter.txt"

# def get_next_counter_value():
#     if os.path.exists(COUNTER_FILE):
#         with open(COUNTER_FILE, "r") as f:
#             counter = int(f.read().strip())
#     else:
#         counter = 0
#     return counter

# def update_counter_file(counter):
#     with open(COUNTER_FILE, "w") as f:
#         f.write(str(counter))