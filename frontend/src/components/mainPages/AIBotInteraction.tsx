// AIBotInteraction.tsx
import React, { useState, useCallback ,useEffect} from 'react';
import AIClass from './AIClass'; // Ensure correct import path
import {Avatar}  from './Avatar';
import axios from 'axios';
import { Button, Select, Layout } from 'antd';
import { Canvas } from "@react-three/fiber";

import { Environment, OrbitControls } from "@react-three/drei";
import '../../styles/mainPageStyle/AIBotInteraction.css';
const { Content, Sider } = Layout;

const AIBotInteraction: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [mispronunciations, setMispronunciations] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState('');
  const [lipsync, setLipsync] = useState(null);
  const [image, setImage] = useState<string | null>(null);

  const fetchBackendData = async () => {
    try {
      const response = await axios.get('/api/v1/backend-data');
      const { question, mispronunciations, keywords, audioUrl, lipsync, image } = response.data;
      setQuestion(question);
      setMispronunciations(mispronunciations);
      setKeywords(keywords);
      setAudioUrl(audioUrl);
      setLipsync(lipsync);
      setImage(image);
    } catch (error) {
      console.error('Error fetching backend data:', error);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const handleVoiceInput = async (voiceBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('voice', voiceBlob);
      const response = await axios.post('/api/v1/process-voice', formData);
      const { mispronunciations, keywords, image } = response.data;
      setMispronunciations(mispronunciations);
      setKeywords(keywords);
      setImage(image);
    } catch (error) {
      console.error('Error processing voice input:', error);
    }
  };

  return (
     
    <Layout className="layout ai-bot-interaction">
      <AIClass
        question={question}
        mispronunciations={mispronunciations}
        keywords={keywords}
        onVoiceInput={handleVoiceInput}
        image={image}
      />
      <Sider width={400} className="custom-sider" style={{ backgroundColor: '#59B379' }}>
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
       <OrbitControls />
      <Avatar position={[0,-3,0]} scale={2} audioUrl={audioUrl} lipsync={lipsync} />
        <Environment preset="sunset"/>
        </Canvas>
      </Sider>
    </Layout>
    
  );
};

export default AIBotInteraction;
