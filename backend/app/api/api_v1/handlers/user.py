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
from app.api.deps.user_deps import get_current_user
from app.schemas.user_schema import PasswordResetRequest, PasswordResetConfirm
import jwt
from bson import ObjectId
from fastapi import APIRouter, Query


user_router = APIRouter()

@user_router.post('/register', summary="Create new user/Register", response_model=UserOut)
async def create_user(data: UserAuth):
    try:
        return await UserService.create_user(data)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exist"
        )

@user_router.put('/profile', summary="Update user info by user_id", response_model=UserOut)
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
        
@user_router.post('/emailreset', summary="Send email reset password", response_model=PasswordResetRequest)
async def reset_password(request: PasswordResetRequest):
    try:
        logger.info(f"Request email: {request.email}")
        await UserService.send_email_request(request.email)
        return JSONResponse(
            content={"message": "Reset email sent successfully!"})
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{e}"
        )
        
@user_router.post("/resetpassword/confirm")
async def reset_password_confirm(request: PasswordResetConfirm):
    try:
        await UserService.reset_password(request.token, request.new_password)
        return JSONResponse(
            content={"message": "Password reset successfully!"})
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{e}"
        )

@user_router.get("/profileview", response_model=UserUpdate)
async def get_user_profile(
    access_token: str = Query(..., alias="access_token"),
    refresh_token: str = Query(..., alias="refresh_token"),
):
    logger.info(f"Request token: {access_token} and {refresh_token}")
    user = await UserService.decode_token(access_token, refresh_token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user