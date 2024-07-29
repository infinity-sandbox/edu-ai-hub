import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import { Select, Layout, Modal, Button } from 'antd';
import '../../styles/mainPageStyle/AIClass.css';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Avatar } from './Avatar';
import Sidebar from '../SideNav/Sidebar';

const { Option } = Select;
const { Content, Sider } = Layout;
const baseUrl = process.env.REACT_APP_BACKEND_API_URL;

const AIClass: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<string>('');
  const [mispronunciations, setMispronunciations] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lipsync, setJsonData] = useState<any>(null);
  const [isClassSelected, setIsClassSelected] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [exampleContent, setExampleContent] = useState<{ type: 'text' | 'image', content: string } | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const webcamRef = useRef<Webcam>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setIsClassSelected(true);
  };

  useEffect(() => {
    if (!selectedClass) return;

    const sendSelectedClass = async () => {
      try {
        const response = await axios.post(baseUrl+'/api/v1/secured/bot/class/interaction/first', 
          { selectedClass },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Refresh-Token': refreshToken,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = response.data;
        setAudioUrl(`${baseUrl}/${data.audio_url}`);
        setJsonData(data.json_data);
        setQuestion(data.question);
        setMispronunciations(data.mispronunciations || []);
        setKeywords(data.keywords || []);
        setExampleContent(data.exampleContent || null);
        setCorrectAnswer([]);
      } catch (error) {
        console.error('Error sending selected class:', error);
      }
    };

    sendSelectedClass();
  }, [selectedClass]);

  useEffect(() => {
    const captureImage = async () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          try {
            const response = await axios.post(baseUrl+'/api/v1/secured/bot/class/interaction/image', 
              { imageSrc },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Refresh-Token': refreshToken,
                  'Content-Type': 'application/json'
                }
              }
            );
            const signal = response.data.signal;
            if (signal === 1) {
              const { audio_url, json_data, mispronunciations, keywords, exampleContent } = response.data;
              setAudioUrl(`${baseUrl}/${audio_url}`);
              setJsonData(json_data);
              setMispronunciations(mispronunciations || []);
              setKeywords(keywords || []);
              setExampleContent(exampleContent || null);
              setCorrectAnswer([]);
              console.log("signal:", signal)
            }
          } catch (error) {
            console.error('Error uploading image or receiving signal:', error);
          }
        }
      }
    };

    const intervalId = setInterval(captureImage, 5000);
    return () => clearInterval(intervalId);
  }, [selectedClass]);

  useEffect(() => {
    if (audioUrl) {
      const audioElement = new Audio(audioUrl);
      audioRef.current = audioElement;
      audioElement.play();
      audioElement.onended = startRecording;
      setIsAudioPlaying(true);
    }
  }, [audioUrl]);

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            sendRecording(event.data);
          }
        };
        mediaRecorder.start();
        startSpeechRecognition();
      })
      .catch(error => console.error('Error accessing microphone:', error));
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
    recognition.start();
  };

  const sendRecording = async (audioBlob: Blob) => {
    setIsRecording(false);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      const response = await axios.post(`${baseUrl}/api/v1/secured/bot/class/interaction/voice`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Refresh-Token': refreshToken,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      const data = response.data;
      setQuestion(data.question);
      setMispronunciations(data.mispronunciations || []);
      setKeywords(data.keywords || []);
      setExampleContent(data.exampleContent || null);
      setCorrectAnswer(data.correctAnswer || []);
      setIsModalVisible(true);
      setAudioUrl(data.audio_url ? `${baseUrl}/${data.audio_url}` : null);
      if (data.audio_url) {
        setIsAudioPlaying(true);
      }
    } catch (error) {
      console.error('Error sending recording:', error);
    }
  };

  const handleNextQuestion = () => {
    setIsAudioPlaying(false);
    setAudioUrl(null);
    setQuestion('');
    setMispronunciations([]);
    setKeywords([]);
    setExampleContent(null);
    setCorrectAnswer([]);
    setIsModalVisible(false);
    fetchNextQuestion();
  };

  const fetchNextQuestion = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/secured/bot/class/interaction/next`, 
        { selectedClass },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Refresh-Token': refreshToken,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = response.data;
      setAudioUrl(`${baseUrl}/${data.audio_url}`);
      setJsonData(data.json_data);
      setQuestion(data.question);
      setMispronunciations(data.mispronunciations || []);
      setKeywords(data.keywords || []);
      setExampleContent(data.exampleContent || null);
      setCorrectAnswer([]);
    } catch (error) {
      console.error('Error fetching next question:', error);
    }
  };

  const handleIncorrectAnswer = () => {
    navigate('/chatroom', { state: { username: 'User', question } });
  };

  return (
    <Layout className="layout ai-class-container">
      <Sidebar handleNavigation={handleNavigation} />
      {!selectedClass ? (
        <div className="subject-selection">
          <h1>Select Class</h1>
          <Select
            onChange={handleClassChange}
            placeholder="Select a class"
            dropdownClassName="custom-dropdown"
            className="subject-dropdown"
          >
            <Option value="english">English</Option>
            <Option value="math">Math</Option>
            <Option value="science">Science</Option>
          </Select>
        </div>
      ) : (
        <div className="classroom">
          <Content className="content">
            <div className="title">
              <h1>{selectedClass} Class</h1>
            </div>
            <div className="webcam-container">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam"
              />
            </div>
            <div className="blackboard">
              <p>
                {question.split(' ').map((word, index) => {
                  const isMispronounced = mispronunciations.includes(word);
                  const isKeyword = keywords.includes(word);
                  const isCorrectAnswer = correctAnswer.includes(word);
                  const className = isMispronounced
                    ? 'mispronounced'
                    : isKeyword
                      ? 'keyword'
                      : isCorrectAnswer
                        ? 'correct-answer'
                        : '';
                  return (
                    <span key={index} className={className}>
                      {word}{' '}
                    </span>
                  );
                })}
              </p>
            </div>
            {audioUrl && isAudioPlaying && (
              <audio src={audioUrl} ref={audioRef} onEnded={startRecording} />
            )}
            {exampleContent && (
              <Modal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
                {exampleContent.type === 'text' ? (
                  <p>{exampleContent.content}</p>
                ) : (
                  <img src={exampleContent.content} alt="Example content" />
                )}
              </Modal>
            )}
            {correctAnswer.length > 0 && (
              <div className="next-question-container">
                <Button onClick={handleNextQuestion}>Next Question</Button>
              </div>
            )}
          </Content>
          <Sider width={400} className="custom-sider">
            <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
              <OrbitControls />
              <Avatar className="avatar" position={[0, -5, 0]} scale={3.5} isPlaying={isAudioPlaying} audioUrl={audioUrl} lipsync={lipsync} />
              <Environment preset="sunset" />
            </Canvas>
          </Sider>
        </div>
      )}
    </Layout>
  );
};

export default AIClass;