import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Input, Avatar, Button, Layout, Typography, Menu } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Avatar as ThreeAvatar } from './Avatar'; // Adjust import path as needed
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import '../../styles/mainPageStyle/ChatRoom.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const socket = io('ws://2a57-196-190-62-181.ngrok-free.app/'); // Replace with your backend socket URL

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ user: string; text: string; isQuestion?: boolean; answered?: boolean }[]>([
    { user: 'Mr. X - Forwarded from AI class', text: 'Which of the following sentences is grammatically correct?\nA) She don\'t like apples.\nB) She doesn\'t likes apples.\nC) She doesn\'t like apples.\nD) She don\'t likes apples.', isQuestion: true, answered: false },
  ]);
  const [selectedClass, setSelectedClass] = useState('English'); // Example initial value
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Example state
  const [audioUrl, setAudioUrl] = useState(''); // Example state
  const [lipsync, setLipsync] = useState({ mouthCues: [] }); // Example state
  const [containerHeight, setContainerHeight] = useState(0);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      setContainerHeight(chatContainerRef.current.scrollHeight);
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', { user: 'User', text: message });
      setMessages((prevMessages) => [...prevMessages, { user: 'User', text: message }]);
      setMessage('');
    }
  };

  const handleRaiseHand = (question: string) => {
    setMessage('Replying to:' + question + '...\n');
  };

  const handleReply = (message: string) => {
    setMessage(`Replying to: ${message} `);
  };

  const memoizedCanvas = useMemo(() => (
    <Canvas shadows camera={{ position: [3, 0, 8], fov: 42 }} style={{ width: '100%', height: '100%' }}>
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
  ), [isAudioPlaying, audioUrl, lipsync]);

  const isOverflowing = containerHeight > window.innerHeight - 200;

  return (
    <Layout className='chat-room'>
      <Header className='chat-header'>
        <Title className='header-title' level={3}>Chat Room</Title>
      </Header>
      <Layout className='main-layout'>
        <Sider width={200} className="site" style={{ background: '#428051'}}>
          <Menu style={{ background: '#428051'}} mode="inline" defaultSelectedKeys={[selectedClass]}>
            <Menu.Item key="English" onClick={() => setSelectedClass('English')}>English</Menu.Item>
            <Menu.Item key="Biology" onClick={() => setSelectedClass('Biology')}>Biology</Menu.Item>
            <Menu.Item key="Maths" onClick={() => setSelectedClass('Maths')}>Maths</Menu.Item>
          </Menu>
        </Sider>
        <Layout className='content-layout'>
          <Content className='chat-content'>
            <ChatContainer ref={chatContainerRef}>
              {isOverflowing ? (
                <SimpleBar style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  {messages.map((msg, index) => (
                    <MessageContainer key={index} user={msg.user}>
                      <AvatarContainer>
                        <Avatar icon={<UserOutlined />} />
                      </AvatarContainer>
                      <MessageContent user={msg.user} isQuestion={msg.isQuestion} answered={msg.answered}>
                        <strong>{msg.user}</strong>
                        <div onClick={() => handleReply(msg.text)}>
                          {msg.text}
                          {msg.isQuestion && !msg.answered && (
                            <Button type="primary" onClick={(e) => { e.stopPropagation(); handleRaiseHand(msg.text); }} className='raise-hand-button'>
                              Raise Hand
                            </Button>
                          )}
                        </div>
                      </MessageContent>
                    </MessageContainer>
                  ))}
                </SimpleBar>
              ) : (
                messages.map((msg, index) => (
                  <MessageContainer key={index} user={msg.user}>
                    <AvatarContainer>
                      <Avatar icon={<UserOutlined />} />
                    </AvatarContainer>
                    <MessageContent user={msg.user} isQuestion={msg.isQuestion} answered={msg.answered}>
                      <strong>{msg.user}</strong>
                      <div onClick={() => handleReply(msg.text)}>
                        {msg.text}
                        {msg.isQuestion && !msg.answered && (
                          <Button type="primary" onClick={(e) => { e.stopPropagation(); handleRaiseHand(msg.text); }} className='raise-hand-button'>
                            Raise Hand
                          </Button>
                        )}
                      </div>
                    </MessageContent>
                  </MessageContainer>
                ))
              )}
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
          <Sider width={500} className='canvas-sider'>
            <FullHeightCanvas>
             
              <h1 style={{}}>This chat is Monitored by AI</h1>
              {memoizedCanvas}
            
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
  height: calc(105vh - 200px); /* Adjust height based on header size */
  padding: 16px;
  border-radius: 8px;
`;

const MessageContainer = styled.div<{ user: string }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  flex-direction: ${(props) => (props.user === 'User' ? 'row-reverse' : 'row')};
`;

const MessageContent = styled.div<{ user: string; isQuestion?: boolean; answered?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: ${(props) => (props.user === 'User' ? '0' : '8px')};
  margin-right: ${(props) => (props.user === 'User' ? '8px' : '0')};
  padding: 8px;
  border-radius: 16px;
  background: ${(props) => (props.isQuestion ? '#428051' : '#fff')};
  color:${(props) => (props.isQuestion ? '#fff' : 'black')}; /* Change question background color */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  max-width: 60%;
  align-self: ${(props) => (props.user === 'User' ? 'flex-end' : 'flex-end')};

  ${(props) => props.isQuestion && 'border: 1px solid #428051;'} /* Change question border color */
`;

const AvatarContainer = styled.div`
  margin-right: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
 
  background: #f0f0f0;
  border-top: 1px solid #d9d9d9;
  
  border-radius: 30px;
`;

const FullHeightCanvas = styled.div`
  height: 100%;
`;

export default ChatRoom;
