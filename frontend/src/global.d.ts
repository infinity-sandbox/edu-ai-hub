// src/global.d.ts

interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

interface SpeechRecognitionEvent {
  results: {
    isFinal: boolean;
    [key: number]: {
      transcript: string;
    };
  }[];
}
