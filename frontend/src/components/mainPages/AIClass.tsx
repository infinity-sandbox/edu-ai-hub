// AIClass.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import { Button, Select, Layout, Modal } from 'antd';
import '../../styles/mainPageStyle/AIClass.css';
import { CameraOutlined } from '@ant-design/icons';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Avatar } from './Avatar';
import Sidebar from '../SideNav/Sidebar';

const { Option } = Select;
const { Content, Sider } = Layout;
const baseUrl = process.env.REACT_APP_BACKEND_API_URL;

const AIClass: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<string>('What is the capital of France?');
  const [mispronunciations, setMispronunciations] = useState<string[]>(['capital']);
  const [keywords, setKeywords] = useState<string[]>(['Paris', 'France', 'capital']);
  const [audio_url, setAudioUrl] = useState<string | null>(null);
  const [lipsync, setJsonData] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string>('Paris');
  const [isClassSelected, setIsClassSelected] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [exampleContent, setExampleContent] = useState<{ type: 'text' | 'image', content: string } | null>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const handleNavigation = (path: string) => {
    navigate(path); // Navigate to the specified path
  };

  const webcamRef = useRef<Webcam>(null);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setIsClassSelected(true);
    setIsAudioPlaying(true);
  };

  useEffect(() => {
    if (!selectedClass) return;

    const sendSelectedClass = async () => {
      try {
        const response = await axios.post(baseUrl + '/api/v1/secured/bot/class/interaction/first', 
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
        setAudioUrl(`${baseUrl}/${data.audio_url}`); // Construct full URL
        setJsonData(data.json_data);
        setQuestion(data.question);
        console.log('Data fetched sucessfully!')
      } catch (error) {
        console.error('Error sending selected class:', error);
      }
    };

    sendSelectedClass();

    const captureImage = () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          axios.post(baseUrl + '/api/v1/secured/bot/class/interaction/image', 
            { imageSrc },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Refresh-Token': refreshToken,
                'Content-Type': 'application/json'
              }
            }
          )
          .catch((error) => console.error('Error uploading image:', error));
        }
      }
    };

    const intervalId = setInterval(captureImage, 5000);
    return () => clearInterval(intervalId);
  }, [selectedClass]);

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recorder) {
      recorder.stop();
    }
  };

  useEffect(() => {
    if (question && mispronunciations && keywords && exampleContent) {
      setIsModalVisible(true);
    }
  }, [question, mispronunciations, keywords, exampleContent]);

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
              {isCaptureEnable ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="webcam"
                  />
                </>
              ) : (
                null
              )}
            </div>
            <div className="blackboard">
              <p>
                {question.split(' ').map((word, index) => (
                  <span
                    key={index}
                    className={mispronunciations.includes(word) ? 'highlight' : ''}
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>
              <div className="keywords">
                {keywords.length > 0 && (
                  <ul>
                    {keywords.map((keyword, index) => (
                      <li key={index}>{keyword}</li>
                    ))}
                  </ul>
                )}
              </div>
              <Modal title="Example" visible={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)}>
                {exampleContent?.type === 'text' ? (
                  <p>{exampleContent.content}</p>
                ) : (
                  <img src={exampleContent?.content} alt="Example visual content" />
                )}
              </Modal>
            </div>
          </Content>
          <Sider width={400} className="custom-sider">
            <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
              <OrbitControls />
              <Avatar className="avatar" position={[0, -5, 0]} scale={3.5} isPlaying={isAudioPlaying} audioUrl={audio_url} lipsync={lipsync} />
              <Environment preset="sunset" />
            </Canvas>
          </Sider>
        </div>
      )}      
    </Layout>
  );
};

export default AIClass;
