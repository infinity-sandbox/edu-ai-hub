import React, { useState, useEffect } from 'react';
import { Input, List, Avatar, Button, Layout, Typography, Menu } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Avatar as ThreeAvatar } from './Avatar'; // Adjust import path as needed

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const socket = io('http://127.0.0.1:8000'); // Replace with your backend socket URL

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ user: string; text: string; isQuestion?: boolean; answered?: boolean }[]>([]);
  const [selectedClass, setSelectedClass] = useState('English'); // Example initial value
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Example state
  const [audioUrl, setAudioUrl] = useState(''); // Example state
  const [lipsync, setLipsync] = useState({ mouthCues: [] }); // Example state

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', { user: 'User', text: message });
      setMessage('');
    }
  };

  const handleRaiseHand = (question: string) => {
    // Logic to handle "Raise Hand" action
  };

  return (
    <Layout className='chat-room' style={{ height: '100vh' }}>
      <Header className='chat-header'>
        <Title style={{ color: 'white' }} level={3}>Chat Room</Title>
      </Header>
      <Layout>
        <Sider width={200} className="site">
          <Menu mode="inline" defaultSelectedKeys={[selectedClass]}>
            <Menu.Item key="English" onClick={() => setSelectedClass('English')}>English</Menu.Item>
            <Menu.Item key="Biology" onClick={() => setSelectedClass('Biology')}>Biology</Menu.Item>
            <Menu.Item key="Maths" onClick={() => setSelectedClass('Maths')}>Maths</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ flex: 1, display: 'flex' }}>
          <Content className='chat-content' style={{ padding: '0 24px', flex: 1 }}>
            <ChatContainer>
              {messages.map((msg, index) => (
                <Message key={index} isQuestion={msg.isQuestion} answered={msg.answered}>
                  <Avatar icon={<UserOutlined />} />
                  <MessageContent>
                    <strong>{msg.user}:</strong> {msg.text}
                  </MessageContent>
                  {msg.isQuestion && !msg.answered && (
                    <Button type="primary" onClick={() => handleRaiseHand(msg.text)} style={{ float: 'right', marginTop: '8px' }}>
                      Raise Hand
                    </Button>
                  )}
                </Message>
              ))}
            </ChatContainer>
            <InputContainer>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onPressEnter={sendMessage}
                placeholder="Type your message..."
                suffix={<SendOutlined onClick={sendMessage} />}
              />
            </InputContainer>
          </Content>
          <Sider width={300} style={{backgroundColor:"red"}}>
            <FullHeightCanvas>
              <Canvas shadows camera={{ position: [3, 0, 8], fov: 42 }} style={{ width: '400px', height: '100%',zIndex: '10', position: 'absolute',
  top: '0',
  right: '0' }}>
                <OrbitControls />
                <ThreeAvatar 
                  position={[0, -5, 1]} 
                  scale={3.5} 
                  isPlaying={isAudioPlaying} 
                  audioUrl={audioUrl} 
                  lipsync={lipsync} 
                />
                <Environment preset="sunset" />
              </Canvas>
            </FullHeightCanvas>
          </Sider>
        </Layout>
      </Layout>
    </Layout>
  );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px); /* Adjust height based on header size */
  overflow-y: scroll;
  padding: 16px;
  background: #f0f0f0;
  border-radius: 8px;
`;

const Message = styled.div<{ isQuestion?: boolean; answered?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
  ${(props) => props.isQuestion && 'border: 1px solid #1890ff; border-radius: 8px;'}
  ${(props) => props.answered && 'background: #e6f7ff;'}
`;

const MessageContent = styled.div`
  background: #ffffff;
  padding: 8px;
  border-radius: 8px;
  margin-left: 8px;
  max-width: 80%;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #ffffff;
  border-top: 1px solid #f0f0f0;
`;

const FullHeightCanvas = styled.div`
  height: 100%;
`;

export default ChatRoom;
