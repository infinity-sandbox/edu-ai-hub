from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from typing import List
import io

# Data model for JSON response
class MouthCue(BaseModel):
    start: float
    end: float
    value: str

class Metadata(BaseModel):
    soundFile: str
    duration: float

class JSONResponseModel(BaseModel):
    metadata: Metadata
    mouthCues: List[MouthCue]