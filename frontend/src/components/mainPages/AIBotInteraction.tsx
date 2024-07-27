import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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
  const navigate = useNavigate(); // Initialize useNavigate
  const [question, setQuestion] = useState<string>('');
  const [mispronunciations, setMispronunciations] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [audio_url, setaudio_url] = useState<string | null>(null);
  const [json_data, setjson_data] = useState<any>(null); // Use appropriate type
  const [image, setImage] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [isClassSelected, setIsClassSelected] = useState<boolean>(false); // Track if class is selected
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [exampleContent, setExampleContent] = useState<{ type: 'text' | 'image', content: string } | null>(null);

  useEffect(()=>{
    if (!setIsClassSelected) return;
      const sendSelectedClass = async () => {
      try {
        const response= await axios.post('https://c5e0-196-191-221-6.ngrok-free.app/api/v1/secured/bot/class/interaction/first', { setIsClassSelected });
        const data = response.data;
        setaudio_url(data.audio_url);
        setjson_data(data.json_data);
        setQuestion(data.question);
      } catch (error) {
        console.error('Error sending selected class:', error);
      }
    };

    sendSelectedClass();
  })
  // useEffect(() => {
  //   // Fetch data from backend on component mount
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('http://127.0.0.1:8000/api/bot-interaction'); // Replace with your actual endpoint
  //       const data = response.data;
        
  //       setQuestion(data.question);
  //       setMispronunciations(data.mispronunciations);
  //       setKeywords(data.keywords);
  //       setaudio_url(data.audio_url);
  //       setjson_data(data.json_data);
  //       setImage(data.image);
  //       setCorrectAnswer(data.correctAnswer);
  //       setExampleContent(data.exampleContent); // Set example content
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();

  //   // Listen for the signal from backend
  //   const eventSource = new EventSource('http://127.0.0.1:8000/api/signal'); // Replace with your actual endpoint
  //   eventSource.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.signal === 'redirect_to_chat') {
  //       navigate('/chat'); // Redirect to ChatRoom
  //     }
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, [navigate]);

  // const handleVoiceInput = async (voiceBlob: Blob) => {
  //   // Send voiceBlob to backend and get data
  //   try {
  //     const formData = new FormData();
  //     formData.append('voice', voiceBlob);

  //     const response = await axios.post('http://127.0.0.1:8000/api/voice-input', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     });
      
  //     const data = response.data;
      
  //     setMispronunciations(data.mispronunciations);
  //     setKeywords(data.keywords);
  //     setImage(data.image);
  //     setaudio_url(data.audio_url);
  //     setjson_data(data.json_data);
  //     setExampleContent(data.exampleContent); // Update example content
  //   } catch (error) {
  //     console.error('Error handling voice input:', error);
  //   }
  // };

  const startAudioPlayback = () => {
    setIsAudioPlaying(true);
  };

  const handleClassSelection = () => {
    setIsClassSelected(true);
    startAudioPlayback();
  };

  return (
    <Layout className="layout ai-bot-interaction">
      <AIClass
        question={question}
        mispronunciations={mispronunciations}
        keywords={keywords}
        // onVoiceInput={handleVoiceInput}
        image={image}
        correctAnswer={correctAnswer}
        onClassSelected={handleClassSelection} // Pass the handler
        exampleContent={exampleContent} // Pass example content
      />
      {isClassSelected && (
        <Sider width={400} className="custom-sider" style={{ backgroundColor: '#59B379' }}>
          <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
            <OrbitControls />
            <Avatar position={[0, -3, 0]} scale={2} audio_url={audio_url} json_data={json_data} isPlaying={isAudioPlaying} />
            <Environment preset="sunset" />
          </Canvas>
        </Sider>
      )}
    </Layout>
  );
};

export default AIBotInteraction;
