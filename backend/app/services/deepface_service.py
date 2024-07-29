import cv2
from deepface import DeepFace
from logs.loggers.logger import logger_config
from typing import Tuple
logger = logger_config(__name__)

# Load face cascade classifier
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'utils/xml/haarcascade_frontalface_default.xml')

async def detect_emotion(image_path: str) -> Tuple[str, int]:
    # Load the image
    frame = cv2.imread(image_path)
    if frame is None:
        logger.debug("Failed to load image")
        return None, None

    # Convert frame to grayscale for face detection
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    try:
        for (x, y, w, h) in faces:
            # Extract the face ROI (Region of Interest)
            face_roi = frame[y:y + h, x:x + w]

            try:
                # Perform emotion analysis on the face ROI
                result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
                # Determine the dominant emotion
                emotion = result[0]['dominant_emotion']
                logger.debug(f"EMOTIONS LIST: {result}")
                logger.info(f"EMOTION: {emotion}")
            except Exception as e:
                emotion = "unknown"
                logger.error(f"Error in emotion analysis: {e}")
            
            # Draw rectangle around face and label with predicted emotion
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
            cv2.putText(frame, emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
            
            all_emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
            #
            included_emotions = ['happy', 'neutral', 'surprise']
            excluded_emotions = ['angry', 'disgust', 'fear', 'sad']
            
            if emotion in included_emotions:
                value: int = 0
            elif emotion in excluded_emotions:
                value: int = 1
            else:
                value: int = 0
        logger.debug(f"emotion: {emotion}, value: {value}")
        return emotion, value
    
    except Exception as e:
        logger.error(f"error: {e}")
        emotion = ''
        value = 0
        return emotion, value

# if __name__ == '__main__':
#     image_path = 'static/captured_image.jpeg'
#     emotion, value = detect_emotion(image_path)
#     print(f"{emotion}, {value}")