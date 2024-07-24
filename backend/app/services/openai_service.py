from openai import OpenAI
from app.core.config import settings
from pydub import AudioSegment
from app.core.config import settings
import subprocess
from logs.loggers.logger import logger_config
logger = logger_config(__name__)

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def speech_to_text(audio_data):
    with open(audio_data, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            response_format="text",
            file=audio_file
        )
    return transcript

def text_to_speech(input_text: str, webm_file_path: str, wav_file_path: str):
    response = client.audio.speech.create(
        model="tts-1",
        voice="nova",
        input=input_text
    )
    # logger.info(f"response: {response}")
    with open(webm_file_path, "wb") as f:
        response.stream_to_file(webm_file_path)
        
    try:
        # Load the WebM file
        audio = AudioSegment.from_file(webm_file_path, format="webm")
        
        # Export as WAV file
        audio.export(wav_file_path, format="wav")
    except Exception as e:
        logger.error(f"Failed to convert {webm_file_path} to WAV: {e}")
        # Optionally, run ffmpeg manually to debug
        command = [
            'ffmpeg',
            '-i', webm_file_path,
            wav_file_path
        ]
        try:
            subprocess.run(command, check=True, capture_output=True, text=True)
        except subprocess.CalledProcessError as e:
            logger.error(f"ffmpeg command failed: {e.stderr}")
            
    return wav_file_path
