from typing import Optional
from uuid import UUID
from app.schemas.user_schema import UserAuth
from app.models.user_model import User
from app.core.security import get_password, verify_password
import pymongo
from app.schemas.user_schema import UserUpdate
from logs.loggers.logger import logger_config
logger = logger_config(__name__)


class UserService:
    @staticmethod
    async def create_user(user: UserAuth):
        user_in = User(
            username=user.username,
            email=user.email,
            hashed_password=get_password(user.password),
            phone_number=user.phone_number,
            birthdate=user.birthdate,
            parent_name=user.parent_name,
            parent_email=user.parent_email,
            school=user.school,
            user_class=user.user_class,
            user_subject=user.user_subject,
            address=user.address,
            security_question=user.security_question,
            security_answer=user.security_answer
            # upload_photo=user.upload_photo
        )
        await user_in.save()
        return user_in
    
    @staticmethod
    async def authenticate(email: str, password: str) -> Optional[User]:
        logger.debug(f"Authenticating user with email: {email}")
        logger.debug(f"Authenticating user with password: {password}")
        user = await UserService.get_user_by_email(email=email)
        logger.info(f"User found: {user}")
        if not user:
            logger.info(f"User not found: {user}")
            return None
        if not verify_password(password=password, hashed_pass=user.hashed_password):
            logger.info(f"Password does not match: {user}")
            return None
        
        return user
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        user = await User.find_one(User.email == email)
        return user
    
    @staticmethod
    async def get_user_by_id(id: UUID) -> Optional[User]:
        user = await User.find_one(User.user_id == id)
        return user
    
    @staticmethod
    async def update_user(id: UUID, data: UserUpdate) -> User:
        user = await User.find_one(User.user_id == id)
        if not user:
            raise pymongo.errors.OperationFailure("User not found")
    
        await user.update({"$set": data.dict(exclude_unset=True)})
        return user