import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, Layout } from 'antd';
import { AudioOutlined, UpOutlined } from '@ant-design/icons';
import axios from 'axios';
import Webcam from 'react-webcam';
import '../../styles/mainPageStyle/AIBotInteraction.css';
import hand from '../../images/raised-hand.svg'

const { Option } = Select;
const { Content } = Layout;

const AIBotInteraction: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Array<{ type: 'user' | 'ai', content: string | JSX.Element }>>([]);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const [recognizedQuestion, setRecognizedQuestion] = useState<string | null>(null);
  const [aiAnswering, setAiAnswering] = useState(false);
  const webcamRef = useRef<Webcam>(null);

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
      setAiAnswering(false);
    } catch (error) {
      console.error(error);
    }

    setWaitingForConfirmation(false);
    setRecognizedQuestion(null);
  };

  const handleHandClick = () => {
    if (aiAnswering) {
      setConversation(prevConversation => [
        ...prevConversation, 
        { type: 'ai', content: 'Is there any question?' }
      ]);
      setAiAnswering(false);
    }
    handleVoiceInput();
  };

  return (
    <Layout className="ai-bot-interaction">
      <Content className="content">
        {!selectedClass ? (
          <div>
            <Select onChange={handleClassSelect} className='dropdownSelectClass' placeholder="Select a class" style={{ width: '100%' }}>
              <Option value="english">English</Option>
              <Option value="math">Math</Option>
              <Option value="science">Science</Option>
              {/* Add more classes as needed */}
            </Select>
          </div>
        ) : (
          <div className="classroom">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam"
            />
            <div className="blackboard">
              {conversation.map((entry, index) => (
                <div key={index} className={`message ${entry.type}`}>
                  {entry.type === 'user' ? 'You: ' : 'AI: '}
                  {entry.content}
                </div>
              ))}
            </div>
            <div className="actions">
              <Button 
                style={{color:"white",backgroundColor:"white",border:"0px"}}
                onClick={handleHandClick} 
                disabled={waitingForConfirmation}
              ><img src={hand} style={{height:"40px"}}/></Button>
              <AudioOutlined onClick={handleVoiceInput} style={{ fontSize: '24px', marginLeft: '16px', cursor: 'pointer' }} />
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default AIBotInteraction;
