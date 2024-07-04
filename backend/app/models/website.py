from typing import Optional, List
from pydantic import BaseModel, Field


class GetQueryPayload(BaseModel):
    query: str
    userId: str
    sessionId: str
    role: Optional[List] = ["public"]

class GetRegeneratePayload(BaseModel):
    query: str
    userId: str
    sessionId: str
    messageId: str
    role: Optional[List] = ["public"]

class GetDatePayload(BaseModel):
    startDate: str
    endDate: str
    userId: str

class GetDate(BaseModel):
    startDate: str
    endDate: str

class GetReactionPayload(BaseModel):
    userId: str
    sessionId: str
    messageId: str
    rating: str
    feedbackText: str