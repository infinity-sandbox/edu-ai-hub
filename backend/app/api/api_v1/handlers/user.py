from fastapi import APIRouter, HTTPException, status
from app.schemas.user_schema import UserAuth, UserOut, UserUpdate
import pymongo
from app.models.user_model import User
from fastapi.responses import JSONResponse
from app.services.user_service import UserService
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from app.models.user_model import User
from app.api.deps.user_deps import get_current_user



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
async def update_user(data: UserUpdate, current_user: User = Depends(get_current_user)):
    try:
        return await UserService.update_user(current_user.user_id, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        