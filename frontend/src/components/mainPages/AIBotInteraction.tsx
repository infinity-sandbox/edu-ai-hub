import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AIClass from './AIClass'; // Ensure correct import path
import { Avatar } from './Avatar';
import { Layout } from 'antd';
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import '../../styles/mainPageStyle/AIBotInteraction.css';

const { Content, Sider } = Layout;

const baseUrl = process.env.REACT_APP_BACKEND_API_URL;

const AIBotInteraction: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [mispronunciations, setMispronunciations] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lipsync, setLipsync] = useState<any>(null); // Use appropriate type
  const [image, setImage] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [isClassSelected, setIsClassSelected] = useState<boolean>(false); // Track if class is selected
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [exampleContent, setExampleContent] = useState<{ type: 'text' | 'image', content: string } | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');

  useEffect(() => {
    if (!selectedClass) return;

    const fetchClassData = async () => {
      try {
        const response = await axios.post(`${baseUrl}/api/v1/secured/bot/class/first`, { 
          selectedClass: selectedClass });
        const data = response.data;

        setQuestion(data.question);
        setAudioUrl(`${baseUrl}/static/new_file.wav`);
        setLipsync(data.json_data);
        setExampleContent(data.exampleContent); // Set example content
      } catch (error) {
        console.error('Error sending selected class:', error);
      }
    };

    fetchClassData();

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

  const handleVoiceInput = async (voiceBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', voiceBlob, 'recorded.wav'); // Ensure 'file' matches backend

    try {
      const response = await axios.post(`${baseUrl}/api/v1/secured/upload-audio`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const data = response.data;
      
      setMispronunciations(data.mispronunciations || []);
      setKeywords(data.keywords || []);
      setImage(data.image || null);
      setAudioUrl(data.file_url || null); // Ensure this matches what the backend sends
      setLipsync(data.lipsync || null);
      setExampleContent(data.exampleContent || null); // Update example content
    } catch (error) {
      console.error('Error handling voice input:',);
    }
  };

  const startAudioPlayback = () => {
    setIsAudioPlaying(true);
  };

  const handleClassSelection = (selectedClass: string) => {
    setSelectedClass(selectedClass);
    setIsClassSelected(true);
    startAudioPlayback();
  };

  return (
    <Layout className="layout ai-bot-interaction">
      <AIClass
        question={question}
        onVoiceInput={handleVoiceInput}
        image={image}
        onClassSelected={handleClassSelection}
        selectedClass={selectedClass}
      />
      {isClassSelected && (
        <Sider width={400} className="custom-sider" style={{ backgroundColor: '#59B379' }}>
          <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
            <OrbitControls />
            <Avatar position={[0, -3, 0]} scale={2} audioUrl={audioUrl} lipsync={lipsync} isPlaying={isAudioPlaying} />
            <Environment preset="sunset" />
          </Canvas>
        </Sider>
      )}
    </Layout>
  );
};

export default AIBotInteraction;
