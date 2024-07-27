import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import { Button, Select, Layout, Modal } from 'antd';
import '../../styles/mainPageStyle/AIClass.css';
import '../../styles/mainPageStyle/AIBotInteraction.css';
import { CameraOutlined } from '@ant-design/icons';
import raiseHand from '../../images/raised-hand.svg';

const { Option } = Select;
const { Content } = Layout;

const baseUrl = process.env.REACT_APP_BACKEND_API_URL;
interface AIClassProps {
  question: string;
  mispronunciations: string[];
  keywords: string[];
  onVoiceInput: (voiceBlob: Blob) => Promise<void>;
  image: string | null;
  correctAnswer: string;
  onClassSelected: () => void;
  exampleContent: { type: 'text' | 'image', content: string } | null;
}

const AIClass: React.FC<AIClassProps> = ({
  question,
  mispronunciations = [], // Default to empty array
  keywords = [], // Default to empty array
  onVoiceInput,
  image,
  correctAnswer,
  onClassSelected,
  exampleContent,
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const webcamRef = useRef<Webcam>(null);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    onClassSelected();
  };

  useEffect(() => {
    if (!selectedClass) return;

    const sendSelectedClass = async () => {
      try {
        await axios.post(baseUrl+'/api/v1/secured/bot/class/interaction/first', {selectedClass} ,{  headers: {
          Authorization: `Bearer ${accessToken}`,
          'Refresh-Token': refreshToken,
          'Content-Type': 'application/json'
        }});

      } catch (error) {
        console.error('Error sending selected class:', error);
      }
    };

    sendSelectedClass();

    const captureImage = () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          axios.post('/api/upload-image', { image: imageSrc })
            .catch((error) => console.error('Error uploading image:', error));
        }
      }
    };

    const intervalId = setInterval(captureImage, 5000);
    return () => clearInterval(intervalId);
  }, [selectedClass]);

  const handleStartRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const newRecorder = new MediaRecorder(stream);
      setRecorder(newRecorder);
      newRecorder.start();

      newRecorder.ondataavailable = (event) => {
        const audioData = event.data;
        const formData = new FormData();
        formData.append('voice', audioData, 'voice.wav');
        
        axios.post('http://127.0.0.1:8000/api/voice-input', formData)
          .then(response => {
            console.log('Voice input sent successfully:', response.data);
            onVoiceInput(audioData);
          })
          .catch(error => {
            console.error('Error sending voice input:', error.response || error.message);
          });
      };
    });
  };

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
    <Content className="content">
      {!selectedClass ? (
        <div>
          <h1 style={{ color: 'white' }}>Select Class</h1>
          <Select
            onChange={handleClassChange}
            placeholder="Select a class"
            dropdownClassName="custom-dropdown"
            className="custom-select"
          >
            <Option value="english">English</Option>
            <Option value="math">Math</Option>
            <Option value="science">Science</Option>
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
            {image && <img src={image} alt="Related visual content" />}
          </div>
          <div className="raise-hand">
            <Button
              onMouseDown={handleStartRecording}
              onMouseUp={handleStopRecording}
              onTouchStart={handleStartRecording}
              onTouchEnd={handleStopRecording}
            >
              Raise Hand
              <img src={raiseHand} style={{height:'30px'}}/>
            </Button>
            {isRecording && <div className="recording-indicator">Recording...</div>}
          </div>
        </div>
      )}

      <Modal title="Example" visible={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)}>
        {exampleContent?.type === 'text' ? (
          <p>{exampleContent.content}</p>
        ) : (
          <img src={exampleContent?.content} alt="Example" />
        )}
      </Modal>
    </Content>
  );
};

export default AIClass;
