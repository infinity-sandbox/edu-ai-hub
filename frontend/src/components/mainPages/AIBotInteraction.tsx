import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, Layout } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import axios from 'axios';
import Webcam from 'react-webcam';
import '../../styles/mainPageStyle/AIBotInteraction.css';

const { Option } = Select;
const { Content } = Layout;

const AIBotInteraction: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Array<{ type: 'user' | 'ai', content: string | JSX.Element }>>([]);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const [recognizedQuestion, setRecognizedQuestion] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    if (selectedClass) {
      promptUserForQuestion();
    }
  }, [selectedClass]);

  const handleClassSelect = (value: string) => {
    setSelectedClass(value);
    setConversation(prevConversation => [
      ...prevConversation, 
      { type: 'ai', content: 'Please ask your question.' }
    ]);
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;

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
  };

  const handleRaiseHand = async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      const res = await axios.post('/api/ai', { image: imageSrc, question: recognizedQuestion });
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
    } catch (error) {
      console.error(error);
    }

    setWaitingForConfirmation(false);
    setRecognizedQuestion(null);
  };

  const promptUserForQuestion = () => {
    handleVoiceInput();
  };

  return (
    <Layout className="ai-bot-interaction">
      <Content className="content">
        {!selectedClass ? (
          <div>
            <Select onChange={handleClassSelect} placeholder="Select a class" dropdownClassName="custom-dropdown">
              <Option value="english">English</Option>
              <Option value="math">Math</Option>
              <Option value="science">Science</Option>
              {/* Add more classes as needed */}
            </Select>
          </div>
        ) : (
          <div className="classroom">
            <div className="class-header">
              <h1>Class: {selectedClass}</h1>
            </div>
            <div className="top-section">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam"
              />
            </div>
            <div className="blackboard">
              {conversation.map((entry, index) => (
                <div key={index} className={`message ${entry.type}`}>
                  {entry.type === 'user' ? 'You: ' : 'AI: '}
                  {entry.content}
                </div>
              ))}
            </div>
            <div className="raise-hand-container">
              <Button
                type="primary"
                shape="round"
                icon={<UpOutlined />}
                size="large"
                onClick={handleVoiceInput}
                className="raise-hand-button"
              >Hand Raise</Button>
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default AIBotInteraction;
