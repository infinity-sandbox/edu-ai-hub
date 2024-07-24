// AIClass.tsx

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

interface AIClassProps {
  question: string;
  mispronunciations: string[];
  keywords: string[];
  onVoiceInput: (voiceBlob: Blob) => Promise<void>;
  image: string | null;
  correctAnswer: string;
  onClassSelected: (selectedClass: string) => void;
  exampleContent: { type: 'text' | 'image', content: string } | null;
}

const AIClass: React.FC<AIClassProps> = ({
  question,
  mispronunciations,
  keywords,
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

  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    onClassSelected(value);
  };

  useEffect(() => {
    const captureImage = () => {
      // if (webcamRef.current) {
      //   const imageSrc = webcamRef.current.getScreenshot();
      //   if (imageSrc) {
      //     axios.post('/api/upload-image', { image: imageSrc })
      //       .catch((error) => console.error('Error uploading image:', error));
      //   }
      // }
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

  useEffect(() => {
    if (exampleContent) {
      setIsModalVisible(true);
    }
  }, [exampleContent]);

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
        <>
          <h1 style={{ color: 'white' }}>AI Class</h1>
          <h2 style={{ color: 'white' }}>{question}</h2>
          <h3 style={{ color: 'white' }}>Mispronunciations: {mispronunciations.join(', ')}</h3>
          <h3 style={{ color: 'white' }}>Keywords: {keywords.join(', ')}</h3>
          {image && <img src={image} alt="Image" />}
          <h3 style={{ color: 'white' }}>Correct Answer: {correctAnswer}</h3>
          {isCaptureEnable && (
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                style={{ display: 'none' }}
              />
              <Button onClick={() => setCaptureEnable(false)} style={{ display: 'none' }}>Enable Webcam</Button>
            </>
          )}
          <Button
            type="primary"
            shape="round"
            onMouseDown={handleStartRecording}
            onMouseUp={handleStopRecording}
            className="raise-hand-button"
          >
            <img src={raiseHand} alt="Raise Hand" className="raise-hand-icon" />
          </Button>
          <Modal
            title="Example Content"
            visible={isModalVisible}
            onOk={() => setIsModalVisible(false)}
            onCancel={() => setIsModalVisible(false)}
          >
            {exampleContent && (
              exampleContent.type === 'text' ? (
                <p>{exampleContent.content}</p>
              ) : (
                <img src={exampleContent.content} alt="Example" />
              )
            )}
          </Modal>
        </>
      )}
    </Content>
  );
};

export default AIClass;
