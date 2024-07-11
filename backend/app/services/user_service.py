from typing import Optional
from uuid import UUID
from app.schemas.user_schema import UserAuth
from app.models.user_model import User
from app.core.security import get_password, verify_password
import pymongo
from app.schemas.user_schema import UserUpdate
from logs.loggers.logger import logger_config
logger = logger_config(__name__)
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from passlib.context import CryptContext
from app.core.config import settings
import smtplib
import jwt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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
        
    @staticmethod
    async def send_email_request(email: str):
        user = await UserService.get_user_by_email(email)
        if not user:
            raise pymongo.errors.OperationFailure("User not found or this email is not registered!")
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        access_token = create_access_token(
            data={"sub": email}, expires_delta=access_token_expires
        )
        reset_link = f"{settings.FRONTEND_API_URL}/PasswordResetPage?token={access_token}"
        # Send the reset link to the user's email
        logger.debug(f"Reset link: {reset_link}")
        status = send_email(email, reset_link)
        if status:
            return logger.debug("Password reset email sent!")
        else:
            return logger.debug("Password reset email not sent!")
    
    
def send_email(email: str, reset_link):
    try:
        # Email details
        sender_email = settings.MY_EMAIL
        receiver_email = email
        subject = "AI BOU PASSWORD RESET LINK REQUEST"
        body = f"Password Reset Link: \n \
                {reset_link}"

        # Create the email message
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = receiver_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))
        # Convert the message to a string
        email_string = message.as_string()
        
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(settings.MY_EMAIL, settings.EMAIL_APP_PASSWORD)
        server.sendmail(settings.MY_EMAIL, email, email_string)
        return True
    except Exception as e:
        logger.error(f"Error: {e}")
        return False
    finally:
        server.quit()
        

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt