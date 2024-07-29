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
from app.schemas.bot_schema import SubjectSelection, BotFirstResponse, ImagePayload, confusedResponse
import shutil
import base64
from io import BytesIO
from PIL import Image
from pathlib import Path
from app.services.emotion import detect_emotion

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
        await OpenAIService.text_to_speech(output_voice_text, webm_file_path, wav_file_path)
        # json_content = await convert_audio_to_json(wav_file_path)
        json_content = {'metadata': {'soundFile': '/Users/abelmitiku/sandbox/edu-ai-hub/backend/static/62df8216_d591_4682_85d5_3d842edac150__0dd247f1_8caa_4e1d_af6e_c35a55267ec0.wav', 'duration': 26.18}, 'mouthCues': [{'start': 0.0, 'end': 0.04, 'value': 'X'}, {'start': 0.04, 'end': 0.11, 'value': 'C'}, {'start': 0.11, 'end': 0.39, 'value': 'E'}, {'start': 0.39, 'end': 0.74, 'value': 'F'}, {'start': 0.74, 'end': 0.81, 'value': 'B'}, {'start': 0.81, 'end': 0.95, 'value': 'E'}, {'start': 0.95, 'end': 1.02, 'value': 'F'}, {'start': 1.02, 'end': 1.09, 'value': 'C'}, {'start': 1.09, 'end': 1.51, 'value': 'F'}, {'start': 1.51, 'end': 1.91, 'value': 'B'}, {'start': 1.91, 'end': 1.97, 'value': 'C'}, {'start': 1.97, 'end': 2.23, 'value': 'B'}, {'start': 2.23, 'end': 2.3, 'value': 'C'}, {'start': 2.3, 'end': 2.39, 'value': 'A'}, {'start': 2.39, 'end': 2.46, 'value': 'B'}, {'start': 2.46, 'end': 2.59, 'value': 'D'}, {'start': 2.59, 'end': 2.66, 'value': 'B'}, {'start': 2.66, 'end': 2.86, 'value': 'D'}, {'start': 2.86, 'end': 2.94, 'value': 'C'}, {'start': 2.94, 'end': 3.03, 'value': 'A'}, {'start': 3.03, 'end': 3.63, 'value': 'X'}, {'start': 3.63, 'end': 3.67, 'value': 'F'}, {'start': 3.67, 'end': 3.71, 'value': 'C'}, {'start': 3.71, 'end': 3.78, 'value': 'B'}, {'start': 3.78, 'end': 3.86, 'value': 'A'}, {'start': 3.86, 'end': 4.05, 'value': 'F'}, {'start': 4.05, 'end': 4.12, 'value': 'B'}, {'start': 4.12, 'end': 4.2, 'value': 'A'}, {'start': 4.2, 'end': 4.33, 'value': 'C'}, {'start': 4.33, 'end': 4.4, 'value': 'B'}, {'start': 4.4, 'end': 4.54, 'value': 'H'}, {'start': 4.54, 'end': 4.68, 'value': 'C'}, {'start': 4.68, 'end': 4.89, 'value': 'B'}, {'start': 4.89, 'end': 5.53, 'value': 'X'}, {'start': 5.53, 'end': 5.61, 'value': 'A'}, {'start': 5.61, 'end': 5.67, 'value': 'C'}, {'start': 5.67, 'end': 5.72, 'value': 'B'}, {'start': 5.72, 'end': 5.79, 'value': 'C'}, {'start': 5.79, 'end': 5.86, 'value': 'B'}, {'start': 5.86, 'end': 5.94, 'value': 'A'}, {'start': 5.94, 'end': 6.23, 'value': 'B'}, {'start': 6.23, 'end': 6.33, 'value': 'C'}, {'start': 6.33, 'end': 6.4, 'value': 'B'}, {'start': 6.4, 'end': 6.5, 'value': 'D'}, {'start': 6.5, 'end': 6.54, 'value': 'C'}, {'start': 6.54, 'end': 6.65, 'value': 'A'}, {'start': 6.65, 'end': 7.1, 'value': 'F'}, {'start': 7.1, 'end': 7.26, 'value': 'X'}, {'start': 7.26, 'end': 7.35, 'value': 'B'}, {'start': 7.35, 'end': 7.63, 'value': 'C'}, {'start': 7.63, 'end': 7.77, 'value': 'B'}, {'start': 7.77, 'end': 7.85, 'value': 'A'}, {'start': 7.85, 'end': 8.01, 'value': 'B'}, {'start': 8.01, 'end': 8.15, 'value': 'F'}, {'start': 8.15, 'end': 8.29, 'value': 'B'}, {'start': 8.29, 'end': 8.43, 'value': 'C'}, {'start': 8.43, 'end': 8.5, 'value': 'B'}, {'start': 8.5, 'end': 8.57, 'value': 'C'}, {'start': 8.57, 'end': 8.99, 'value': 'B'}, {'start': 8.99, 'end': 9.06, 'value': 'E'}, {'start': 9.06, 'end': 9.13, 'value': 'G'}, {'start': 9.13, 'end': 9.2, 'value': 'E'}, {'start': 9.2, 'end': 9.41, 'value': 'B'}, {'start': 9.41, 'end': 9.69, 'value': 'E'}, {'start': 9.69, 'end': 9.9, 'value': 'B'}, {'start': 9.9, 'end': 10.53, 'value': 'X'}, {'start': 10.53, 'end': 10.6, 'value': 'C'}, {'start': 10.6, 'end': 10.67, 'value': 'B'}, {'start': 10.67, 'end': 10.74, 'value': 'C'}, {'start': 10.74, 'end': 10.82, 'value': 'A'}, {'start': 10.82, 'end': 11.02, 'value': 'B'}, {'start': 11.02, 'end': 11.23, 'value': 'F'}, {'start': 11.23, 'end': 11.3, 'value': 'C'}, {'start': 11.3, 'end': 11.38, 'value': 'A'}, {'start': 11.38, 'end': 11.58, 'value': 'F'}, {'start': 11.58, 'end': 11.79, 'value': 'E'}, {'start': 11.79, 'end': 11.86, 'value': 'C'}, {'start': 11.86, 'end': 11.93, 'value': 'B'}, {'start': 11.93, 'end': 12.07, 'value': 'C'}, {'start': 12.07, 'end': 12.28, 'value': 'B'}, {'start': 12.28, 'end': 12.42, 'value': 'C'}, {'start': 12.42, 'end': 12.7, 'value': 'B'}, {'start': 12.7, 'end': 12.77, 'value': 'C'}, {'start': 12.77, 'end': 12.88, 'value': 'A'}, {'start': 12.88, 'end': 12.94, 'value': 'B'}, {'start': 12.94, 'end': 12.99, 'value': 'C'}, {'start': 12.99, 'end': 13.48, 'value': 'B'}, {'start': 13.48, 'end': 13.56, 'value': 'C'}, {'start': 13.56, 'end': 13.7, 'value': 'B'}, {'start': 13.7, 'end': 13.78, 'value': 'A'}, {'start': 13.78, 'end': 13.86, 'value': 'B'}, {'start': 13.86, 'end': 13.96, 'value': 'A'}, {'start': 13.96, 'end': 14.03, 'value': 'B'}, {'start': 14.03, 'end': 14.09, 'value': 'G'}, {'start': 14.09, 'end': 14.16, 'value': 'C'}, {'start': 14.16, 'end': 14.3, 'value': 'B'}, {'start': 14.3, 'end': 14.51, 'value': 'F'}, {'start': 14.51, 'end': 14.72, 'value': 'B'}, {'start': 14.72, 'end': 15.0, 'value': 'C'}, {'start': 15.0, 'end': 15.21, 'value': 'B'}, {'start': 15.21, 'end': 15.28, 'value': 'C'}, {'start': 15.28, 'end': 15.7, 'value': 'B'}, {'start': 15.7, 'end': 15.78, 'value': 'A'}, {'start': 15.78, 'end': 15.84, 'value': 'C'}, {'start': 15.84, 'end': 16.18, 'value': 'B'}, {'start': 16.18, 'end': 16.39, 'value': 'C'}, {'start': 16.39, 'end': 16.67, 'value': 'B'}, {'start': 16.67, 'end': 16.88, 'value': 'F'}, {'start': 16.88, 'end': 16.95, 'value': 'C'}, {'start': 16.95, 'end': 17.03, 'value': 'A'}, {'start': 17.03, 'end': 17.17, 'value': 'F'}, {'start': 17.17, 'end': 17.87, 'value': 'B'}, {'start': 17.87, 'end': 18.22, 'value': 'E'}, {'start': 18.22, 'end': 18.43, 'value': 'B'}, {'start': 18.43, 'end': 19.02, 'value': 'X'}, {'start': 19.02, 'end': 19.28, 'value': 'B'}, {'start': 19.28, 'end': 19.35, 'value': 'G'}, {'start': 19.35, 'end': 19.42, 'value': 'F'}, {'start': 19.42, 'end': 19.49, 'value': 'C'}, {'start': 19.49, 'end': 19.56, 'value': 'G'}, {'start': 19.56, 'end': 19.63, 'value': 'C'}, {'start': 19.63, 'end': 19.84, 'value': 'B'}, {'start': 19.84, 'end': 19.91, 'value': 'F'}, {'start': 19.91, 'end': 19.98, 'value': 'C'}, {'start': 19.98, 'end': 20.12, 'value': 'B'}, {'start': 20.12, 'end': 20.33, 'value': 'C'}, {'start': 20.33, 'end': 20.47, 'value': 'B'}, {'start': 20.47, 'end': 20.61, 'value': 'E'}, {'start': 20.61, 'end': 20.96, 'value': 'B'}, {'start': 20.96, 'end': 21.17, 'value': 'C'}, {'start': 21.17, 'end': 21.24, 'value': 'H'}, {'start': 21.24, 'end': 21.58, 'value': 'A'}, {'start': 21.58, 'end': 21.82, 'value': 'B'}, {'start': 21.82, 'end': 21.89, 'value': 'G'}, {'start': 21.89, 'end': 22.03, 'value': 'B'}, {'start': 22.03, 'end': 22.1, 'value': 'G'}, {'start': 22.1, 'end': 22.24, 'value': 'B'}, {'start': 22.24, 'end': 22.31, 'value': 'F'}, {'start': 22.31, 'end': 22.59, 'value': 'C'}, {'start': 22.59, 'end': 22.9, 'value': 'B'}, {'start': 22.9, 'end': 22.96, 'value': 'C'}, {'start': 22.96, 'end': 23.02, 'value': 'B'}, {'start': 23.02, 'end': 23.1, 'value': 'A'}, {'start': 23.1, 'end': 23.19, 'value': 'B'}, {'start': 23.19, 'end': 23.33, 'value': 'F'}, {'start': 23.33, 'end': 23.47, 'value': 'C'}, {'start': 23.47, 'end': 23.55, 'value': 'A'}, {'start': 23.55, 'end': 23.81, 'value': 'F'}, {'start': 23.81, 'end': 24.09, 'value': 'B'}, {'start': 24.09, 'end': 24.15, 'value': 'H'}, {'start': 24.15, 'end': 24.55, 'value': 'B'}, {'start': 24.55, 'end': 24.69, 'value': 'D'}, {'start': 24.69, 'end': 24.97, 'value': 'B'}, {'start': 24.97, 'end': 25.25, 'value': 'C'}, {'start': 25.25, 'end': 25.6, 'value': 'B'}, {'start': 25.6, 'end': 25.68, 'value': 'A'}, {'start': 25.68, 'end': 25.73, 'value': 'C'}, {'start': 25.73, 'end': 25.85, 'value': 'B'}, {'start': 25.85, 'end': 26.06, 'value': 'E'}, {'start': 26.06, 'end': 26.18, 'value': 'X'}]}

        return BotFirstResponse(
            audio_url=wav_file_path,
            json_data=json_content,
            question=formatted_question
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@secured_router.post("/bot/class/interaction/image", summary="Image interaction of bot class", response_model=confusedResponse)
async def upload_image(payload: ImagePayload,
                       authorization: str = Header(...),
                       refresh_token: str = Header(...)):
    try:
        user = await UserService.decode_token(authorization, refresh_token)
        logger.info(f"user: {user.email}")
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    try:
        # Decode the base64 image
        image_data = base64.b64decode(payload.imageSrc.split(",")[1])
        image = Image.open(BytesIO(image_data))

        # Ensure the directory exists
        Path("static").mkdir(parents=True, exist_ok=True)
        
        # Save the image
        file_location = f"static/captured_image.jpeg"  # Or use any dynamic filename logic if needed
        image.save(file_location, format="JPEG")
        logger.info(f"Image saved at '{file_location}'")
        emotion, value = await detect_emotion(file_location)
        audio_url = 'static/once_upon_a_time.wav'
        # json_content = await convert_audio_to_json(audio_url)
        json_content = {'metadata': {'soundFile': '/static/once_upon_a_time.wav', 'duration': 26.18}, 'mouthCues': [{'start': 0.0, 'end': 0.04, 'value': 'X'}, {'start': 0.04, 'end': 0.11, 'value': 'C'}, {'start': 0.11, 'end': 0.39, 'value': 'E'}, {'start': 0.39, 'end': 0.74, 'value': 'F'}, {'start': 0.74, 'end': 0.81, 'value': 'B'}, {'start': 0.81, 'end': 0.95, 'value': 'E'}, {'start': 0.95, 'end': 1.02, 'value': 'F'}, {'start': 1.02, 'end': 1.09, 'value': 'C'}, {'start': 1.09, 'end': 1.51, 'value': 'F'}, {'start': 1.51, 'end': 1.91, 'value': 'B'}, {'start': 1.91, 'end': 1.97, 'value': 'C'}, {'start': 1.97, 'end': 2.23, 'value': 'B'}, {'start': 2.23, 'end': 2.3, 'value': 'C'}, {'start': 2.3, 'end': 2.39, 'value': 'A'}, {'start': 2.39, 'end': 2.46, 'value': 'B'}, {'start': 2.46, 'end': 2.59, 'value': 'D'}, {'start': 2.59, 'end': 2.66, 'value': 'B'}, {'start': 2.66, 'end': 2.86, 'value': 'D'}, {'start': 2.86, 'end': 2.94, 'value': 'C'}, {'start': 2.94, 'end': 3.03, 'value': 'A'}, {'start': 3.03, 'end': 3.63, 'value': 'X'}, {'start': 3.63, 'end': 3.67, 'value': 'F'}, {'start': 3.67, 'end': 3.71, 'value': 'C'}, {'start': 3.71, 'end': 3.78, 'value': 'B'}, {'start': 3.78, 'end': 3.86, 'value': 'A'}, {'start': 3.86, 'end': 4.05, 'value': 'F'}, {'start': 4.05, 'end': 4.12, 'value': 'B'}, {'start': 4.12, 'end': 4.2, 'value': 'A'}, {'start': 4.2, 'end': 4.33, 'value': 'C'}, {'start': 4.33, 'end': 4.4, 'value': 'B'}, {'start': 4.4, 'end': 4.54, 'value': 'H'}, {'start': 4.54, 'end': 4.68, 'value': 'C'}, {'start': 4.68, 'end': 4.89, 'value': 'B'}, {'start': 4.89, 'end': 5.53, 'value': 'X'}, {'start': 5.53, 'end': 5.61, 'value': 'A'}, {'start': 5.61, 'end': 5.67, 'value': 'C'}, {'start': 5.67, 'end': 5.72, 'value': 'B'}, {'start': 5.72, 'end': 5.79, 'value': 'C'}, {'start': 5.79, 'end': 5.86, 'value': 'B'}, {'start': 5.86, 'end': 5.94, 'value': 'A'}, {'start': 5.94, 'end': 6.23, 'value': 'B'}, {'start': 6.23, 'end': 6.33, 'value': 'C'}, {'start': 6.33, 'end': 6.4, 'value': 'B'}, {'start': 6.4, 'end': 6.5, 'value': 'D'}, {'start': 6.5, 'end': 6.54, 'value': 'C'}, {'start': 6.54, 'end': 6.65, 'value': 'A'}, {'start': 6.65, 'end': 7.1, 'value': 'F'}, {'start': 7.1, 'end': 7.26, 'value': 'X'}, {'start': 7.26, 'end': 7.35, 'value': 'B'}, {'start': 7.35, 'end': 7.63, 'value': 'C'}, {'start': 7.63, 'end': 7.77, 'value': 'B'}, {'start': 7.77, 'end': 7.85, 'value': 'A'}, {'start': 7.85, 'end': 8.01, 'value': 'B'}, {'start': 8.01, 'end': 8.15, 'value': 'F'}, {'start': 8.15, 'end': 8.29, 'value': 'B'}, {'start': 8.29, 'end': 8.43, 'value': 'C'}, {'start': 8.43, 'end': 8.5, 'value': 'B'}, {'start': 8.5, 'end': 8.57, 'value': 'C'}, {'start': 8.57, 'end': 8.99, 'value': 'B'}, {'start': 8.99, 'end': 9.06, 'value': 'E'}, {'start': 9.06, 'end': 9.13, 'value': 'G'}, {'start': 9.13, 'end': 9.2, 'value': 'E'}, {'start': 9.2, 'end': 9.41, 'value': 'B'}, {'start': 9.41, 'end': 9.69, 'value': 'E'}, {'start': 9.69, 'end': 9.9, 'value': 'B'}, {'start': 9.9, 'end': 10.53, 'value': 'X'}, {'start': 10.53, 'end': 10.6, 'value': 'C'}, {'start': 10.6, 'end': 10.67, 'value': 'B'}, {'start': 10.67, 'end': 10.74, 'value': 'C'}, {'start': 10.74, 'end': 10.82, 'value': 'A'}, {'start': 10.82, 'end': 11.02, 'value': 'B'}, {'start': 11.02, 'end': 11.23, 'value': 'F'}, {'start': 11.23, 'end': 11.3, 'value': 'C'}, {'start': 11.3, 'end': 11.38, 'value': 'A'}, {'start': 11.38, 'end': 11.58, 'value': 'F'}, {'start': 11.58, 'end': 11.79, 'value': 'E'}, {'start': 11.79, 'end': 11.86, 'value': 'C'}, {'start': 11.86, 'end': 11.93, 'value': 'B'}, {'start': 11.93, 'end': 12.07, 'value': 'C'}, {'start': 12.07, 'end': 12.28, 'value': 'B'}, {'start': 12.28, 'end': 12.42, 'value': 'C'}, {'start': 12.42, 'end': 12.7, 'value': 'B'}, {'start': 12.7, 'end': 12.77, 'value': 'C'}, {'start': 12.77, 'end': 12.88, 'value': 'A'}, {'start': 12.88, 'end': 12.94, 'value': 'B'}, {'start': 12.94, 'end': 12.99, 'value': 'C'}, {'start': 12.99, 'end': 13.48, 'value': 'B'}, {'start': 13.48, 'end': 13.56, 'value': 'C'}, {'start': 13.56, 'end': 13.7, 'value': 'B'}, {'start': 13.7, 'end': 13.78, 'value': 'A'}, {'start': 13.78, 'end': 13.86, 'value': 'B'}, {'start': 13.86, 'end': 13.96, 'value': 'A'}, {'start': 13.96, 'end': 14.03, 'value': 'B'}, {'start': 14.03, 'end': 14.09, 'value': 'G'}, {'start': 14.09, 'end': 14.16, 'value': 'C'}, {'start': 14.16, 'end': 14.3, 'value': 'B'}, {'start': 14.3, 'end': 14.51, 'value': 'F'}, {'start': 14.51, 'end': 14.72, 'value': 'B'}, {'start': 14.72, 'end': 15.0, 'value': 'C'}, {'start': 15.0, 'end': 15.21, 'value': 'B'}, {'start': 15.21, 'end': 15.28, 'value': 'C'}, {'start': 15.28, 'end': 15.7, 'value': 'B'}, {'start': 15.7, 'end': 15.78, 'value': 'A'}, {'start': 15.78, 'end': 15.84, 'value': 'C'}, {'start': 15.84, 'end': 16.18, 'value': 'B'}, {'start': 16.18, 'end': 16.39, 'value': 'C'}, {'start': 16.39, 'end': 16.67, 'value': 'B'}, {'start': 16.67, 'end': 16.88, 'value': 'F'}, {'start': 16.88, 'end': 16.95, 'value': 'C'}, {'start': 16.95, 'end': 17.03, 'value': 'A'}, {'start': 17.03, 'end': 17.17, 'value': 'F'}, {'start': 17.17, 'end': 17.87, 'value': 'B'}, {'start': 17.87, 'end': 18.22, 'value': 'E'}, {'start': 18.22, 'end': 18.43, 'value': 'B'}, {'start': 18.43, 'end': 19.02, 'value': 'X'}, {'start': 19.02, 'end': 19.28, 'value': 'B'}, {'start': 19.28, 'end': 19.35, 'value': 'G'}, {'start': 19.35, 'end': 19.42, 'value': 'F'}, {'start': 19.42, 'end': 19.49, 'value': 'C'}, {'start': 19.49, 'end': 19.56, 'value': 'G'}, {'start': 19.56, 'end': 19.63, 'value': 'C'}, {'start': 19.63, 'end': 19.84, 'value': 'B'}, {'start': 19.84, 'end': 19.91, 'value': 'F'}, {'start': 19.91, 'end': 19.98, 'value': 'C'}, {'start': 19.98, 'end': 20.12, 'value': 'B'}, {'start': 20.12, 'end': 20.33, 'value': 'C'}, {'start': 20.33, 'end': 20.47, 'value': 'B'}, {'start': 20.47, 'end': 20.61, 'value': 'E'}, {'start': 20.61, 'end': 20.96, 'value': 'B'}, {'start': 20.96, 'end': 21.17, 'value': 'C'}, {'start': 21.17, 'end': 21.24, 'value': 'H'}, {'start': 21.24, 'end': 21.58, 'value': 'A'}, {'start': 21.58, 'end': 21.82, 'value': 'B'}, {'start': 21.82, 'end': 21.89, 'value': 'G'}, {'start': 21.89, 'end': 22.03, 'value': 'B'}, {'start': 22.03, 'end': 22.1, 'value': 'G'}, {'start': 22.1, 'end': 22.24, 'value': 'B'}, {'start': 22.24, 'end': 22.31, 'value': 'F'}, {'start': 22.31, 'end': 22.59, 'value': 'C'}, {'start': 22.59, 'end': 22.9, 'value': 'B'}, {'start': 22.9, 'end': 22.96, 'value': 'C'}, {'start': 22.96, 'end': 23.02, 'value': 'B'}, {'start': 23.02, 'end': 23.1, 'value': 'A'}, {'start': 23.1, 'end': 23.19, 'value': 'B'}, {'start': 23.19, 'end': 23.33, 'value': 'F'}, {'start': 23.33, 'end': 23.47, 'value': 'C'}, {'start': 23.47, 'end': 23.55, 'value': 'A'}, {'start': 23.55, 'end': 23.81, 'value': 'F'}, {'start': 23.81, 'end': 24.09, 'value': 'B'}, {'start': 24.09, 'end': 24.15, 'value': 'H'}, {'start': 24.15, 'end': 24.55, 'value': 'B'}, {'start': 24.55, 'end': 24.69, 'value': 'D'}, {'start': 24.69, 'end': 24.97, 'value': 'B'}, {'start': 24.97, 'end': 25.25, 'value': 'C'}, {'start': 25.25, 'end': 25.6, 'value': 'B'}, {'start': 25.6, 'end': 25.68, 'value': 'A'}, {'start': 25.68, 'end': 25.73, 'value': 'C'}, {'start': 25.73, 'end': 25.85, 'value': 'B'}, {'start': 25.85, 'end': 26.06, 'value': 'E'}, {'start': 26.06, 'end': 26.18, 'value': 'X'}]}
        return confusedResponse(
            signal=value,
            audio_url=audio_url,
            json_data=json_content
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving image: {str(e)}")
