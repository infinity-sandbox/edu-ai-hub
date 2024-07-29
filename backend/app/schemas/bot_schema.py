from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from typing import List
import io

# Data model for subject selection input
class SubjectSelection(BaseModel):
    selectedClass: str

# Data model for json mouth cues response
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

# Display text on the blackboard
class DisplayText(BaseModel):
    text: str
    
class BotFirstResponse(BaseModel):
    audio_url: str
    json_data: JSONResponseModel
    question: str

class ImagePayload(BaseModel):
    imageSrc: str
    
class confusedResponse(BaseModel):
    signal: int
    audio_url: str
    json_data: JSONResponseModel