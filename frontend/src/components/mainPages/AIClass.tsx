import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { Button, Select, Layout } from 'antd';
import '../../styles/mainPageStyle/AIClass.css';
import { CameraOutlined } from '@ant-design/icons';
import raiseHand from '../../images/raised-hand.svg'
const { Option } = Select;
const { Content } = Layout;

interface AIClassProps {
  question: string;
  mispronunciations: string[];
  keywords: string[];
  onVoiceInput: (voiceBlob: Blob) => Promise<void>;
  image: string | null;
}

const AIClass: React.FC<AIClassProps> = ({
  question,
  mispronunciations,
  keywords,
  onVoiceInput,
  image,
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
  };

  useEffect(() => {
    if (!selectedClass) return;

    const captureImage = () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          axios.post('/api/upload-image', { image: imageSrc });
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
        onVoiceInput(audioData);
      };
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recorder) {
      recorder.stop();
    }
  };

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
    </Content>
  );
};

export default AIClass;
