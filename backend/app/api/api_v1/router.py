from fastapi import APIRouter
from app.api.api_v1.handlers import user, secured
from app.api.auth.jwt import auth_router

router = APIRouter()

router.include_router(auth_router, prefix='/auth', tags=["auth"])
router.include_router(user.user_router, prefix='/users', tags=["users"])
# NOTE: CHANGE SECURED ROUTE FROM THE FRONTEND
router.include_router(secured.secured_router, prefix='/secured', tags=["secured"])
