import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Select, Layout } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import axios from 'axios';
import Webcam from 'react-webcam';
import '../../styles/mainPageStyle/AIBotInteraction.css';
import raiseHandImage from '../../images/raised-hand.svg';
import { Canvas } from "@react-three/fiber";
import { Experience } from "../Experience";

const { Option } = Select;
const { Content, Sider } = Layout;

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

type SpeechRecognition = any;

const AIBotInteraction: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Array<{ type: 'user' | 'ai', content: string | JSX.Element }>>([]);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const [recognizedQuestion, setRecognizedQuestion] = useState<string | null>(null);
  const [questionHistory, setQuestionHistory] = useState<Array<{ subject: string, question: string, answer: string | JSX.Element }>>([]);
  const [speechText, setSpeechText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  useEffect(() => {
    if (selectedClass) {
      promptUserForQuestion();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (isRecording && mediaStream && analyser) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(mediaStream);
      const analyserNode = audioContext.createAnalyser();
      source.connect(analyserNode);
      setAudioCtx(audioContext);
      setAnalyser(analyserNode);

      const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
      setAudioData(dataArray);

      const draw = () => {
        analyserNode.getByteTimeDomainData(dataArray);
        setAudioData(new Uint8Array(dataArray));
        if (isRecording) {
          requestAnimationFrame(draw);
        }
      };
      draw();
    } else {
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      setAudioData(null);
    }
  }, [isRecording, mediaStream, analyser, audioCtx]);

  const handleClassSelect = (value: string) => {
    setSelectedClass(value);
    setConversation(prevConversation => [
      ...prevConversation, 
      { type: 'ai', content: 'Please ask your question.' }
    ]);
  };

  const handleVoiceInput = useCallback(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpeechText(transcript);

      if (waitingForConfirmation) {
        if (transcript.toLowerCase() === 'yes') {
          handleRaiseHand();
        } else if (transcript.toLowerCase() === 'no') {
          setConversation(prevConversation => [
            ...prevConversation, 
            { type: 'ai', content: 'Please ask your question again.' }
          ]);
          setWaitingForConfirmation(false);
        }
      } else {
        setRecognizedQuestion(transcript);
        setConversation(prevConversation => [
          ...prevConversation, 
          { type: 'user', content: transcript },
          { type: 'ai', content: `Did you ask: "${transcript}"? Please say "yes" or "no".` }
        ]);
        setWaitingForConfirmation(true);
      }
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsRecording(false);
    };
  }, [waitingForConfirmation]);

  const handleRaiseHand = async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot() || '';
      const formData = new FormData();
      formData.append('image', imageSrc);
      formData.append('question', recognizedQuestion || '');

      if (recordedChunks.length > 0) {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
        formData.append('audio', audioBlob);
      }

      const res = await axios.post('/api/ai', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const aiResponse = res.data.answer;
      let aiContent: string | JSX.Element;

      if (res.data.type === 'image') {
        aiContent = <img src={aiResponse} alt="AI Response" />;
      } else {
        aiContent = aiResponse;
      }

      setConversation(prevConversation => [
        ...prevConversation, 
        { type: 'ai', content: aiContent }
      ]);

      setQuestionHistory(prevHistory => [
        ...prevHistory,
        { subject: selectedClass!, question: recognizedQuestion!, answer: aiContent }
      ]);
    } catch (error) {
      console.error(error);
    }

    setWaitingForConfirmation(false);
    setRecognizedQuestion(null);
  };

  const promptUserForQuestion = () => {
    handleVoiceInput();
  };

  const handleButtonMouseDown = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      handleVoiceInput();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      mediaRecorder.start();

      recognitionRef.current.onend = () => {
        mediaRecorder.stop();
      };
    } catch (error) {
      console.error('Error accessing microphone', error);
    }
  };

  const handleButtonMouseUp = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setSpeechText('');
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    saveRecording();
  };

  const saveRecording = () => {
    if (recordedChunks.length > 0) {
      const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
      const url = window.URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'UserVoice.webm';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Layout className="layout ai-bot-interaction">
      <Content className="content">
        {!selectedClass ? (
          <div>
            <h1 style={{ color: 'white' }}>Select Class</h1>
            <Select 
              onChange={handleClassSelect} 
              placeholder="Select a class" 
              dropdownClassName="custom-dropdown"
              className="custom-select"
            >
              <Option value="english">English</Option>
              <Option value="math">Math</Option>
              <Option value="science">Science</Option>
              {/* Add more classes as needed */}
            </Select>
          </div>
        ) : (
          <div className="classroom">
            <div className="class-header">
              <h1>{selectedClass} Class</h1>
            </div>
            <div className="top-section">
              {isCaptureEnable || (
                <Button 
                  style={{ position:'fixed', backgroundColor:"#59B379", border:'none', fontSize:'60px' }} 
                  onClick={() => setCaptureEnable(true)}
                >
                  <CameraOutlined />
                </Button>
              )}
              {isCaptureEnable && (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="webcam"
                  />
                  <div>
                    <Button 
                      style={{ color: 'red', position:'fixed', backgroundColor:"#59B379", border:'none', fontSize:'30px' }} 
                      onClick={() => setCaptureEnable(false)}
                    >
                      <b>X</b> 
                    </Button>
                  </div>
                </>
              )}
            </div>
            <div className="blackboard">
              {conversation.map((entry, index) => (
                <div key={index} className={`message ${entry.type}`}>
                  {entry.type === 'user' ? 'You: ' : 'AI: '}
                  {entry.content}
                </div>
              ))}
              {isRecording && audioData && (
                <canvas
                  className="audio-wave"
                  ref={(canvas) => {
                    if (canvas && audioData) {
                      const context = canvas.getContext('2d');
                      if (context) {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.lineWidth = 2;
                        context.strokeStyle = 'white';
                        context.beginPath();
                        const sliceWidth = (canvas.width * 1.0) / audioData.length;
                        let x = 0;
                        for (let i = 0; i < audioData.length; i++) {
                          const v = audioData[i] / 128.0;
                          const y = (v * canvas.height) / 2;
                          if (i === 0) {
                            context.moveTo(x, y);
                          } else {
                            context.lineTo(x, y);
                          }
                          x += sliceWidth;
                        }
                        context.lineTo(canvas.width, canvas.height / 2);
                        context.stroke();
                      }
                    }
                  }}
                />
              )}
            </div>
            <div className="raise-hand-container">
              <Button
                type="primary"
                shape="round"
                size="large"
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                className="raise-hand-button"
              >
                <img style={{ height: '40px' }} src={raiseHandImage} alt="Raise Hand" />
                {isRecording && <div className="wave-container">Recording...</div>}
              </Button>
            </div>
          </div>
        )}
      </Content>
      <Sider width={400} className="custom-sider" style={{ backgroundColor: '#59B379' }}>
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
          <Experience />
        </Canvas>
      </Sider>
    </Layout>
  );
};

export default AIBotInteraction;
