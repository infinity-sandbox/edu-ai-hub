import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input, Avatar, Button, Layout, Typography, Menu } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Avatar as ThreeAvatar } from './Avatar';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import '../../styles/mainPageStyle/ChatRoom.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

type ChatMessage = {
  user: string;
  text: string;
  className: string;
  isQuestion?: boolean;
  answered?: boolean;
  forwardedFrom?: string;
  isAIWarning?: boolean;
  isAppreciation?: boolean;
};

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedClass, setSelectedClass] = useState('English');
  const [filteredMessages, setFilteredMessages] = useState<ChatMessage[]>([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [lipsync, setLipsync] = useState({ mouthCues: [] });
  const [containerHeight, setContainerHeight] = useState(0);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredMessages(messages.filter(msg => msg.className === selectedClass));
  }, [messages, selectedClass]);

  useEffect(() => {
    if (chatContainerRef.current) {
      setContainerHeight(chatContainerRef.current.scrollHeight);
    }
  }, [filteredMessages]);

  const sendMessage = () => {
    if (message.trim()) {
      const username = localStorage.getItem('username') || 'Unknown User';
      const newMessage: ChatMessage = {
        user: username,
        text: message,
        className: selectedClass
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const aiResponse: ChatMessage = {
        user: 'AI',
        text: 'I am currently learning and there are no registered users. Your message has been received and will be processed soon.',
        className: selectedClass
      };

      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setMessage('');
      setReplyTo(null);
    }
  };

  const handleRaiseHand = (question: string) => {
    setMessage(`Replying to: ${question}...\n`);
    setReplyTo(question);
  };

  const handleReply = (message: string) => {
    setReplyTo(message);
    setMessage(`Replying to: ${message} `);
  };

  const memoizedCanvas = useMemo(() => (
    <Canvas shadows className='avatar' camera={{ position: [3, 0, 8], fov: 42 }} style={{ width: '100%', height: '100%' }}>
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
        <Title className='header-title' style={{color:'white'}} level={3}>Chat Room</Title>
      </Header>
      <Layout className='main-layout'>
        <Sider width={200} className="site" style={{ background: '#428051' }}>
          <Menu mode="inline" defaultSelectedKeys={[selectedClass]} style={{ background: '#428051' }}>
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
                  {filteredMessages.map((msg, index) => (
                    <MessageContainer key={index} user={msg.user}>
                      <AvatarContainer>
                        <Avatar icon={<UserOutlined />} />
                      </AvatarContainer>
                      <MessageContent
                        user={msg.user}
                        isQuestion={msg.isQuestion}
                        answered={msg.answered}
                        isAIWarning={msg.isAIWarning}
                        isAppreciation={msg.isAppreciation}
                      >
                        <strong>{msg.user}</strong>
                        <div onClick={() => handleReply(msg.text)}>
                          {msg.forwardedFrom && <div>(Forwarded from {msg.forwardedFrom})</div>}
                          {msg.text}
                        </div>
                        {msg.isQuestion && (
                          <Button
                            onClick={() => handleRaiseHand(msg.text)}
                            style={{ marginTop: '8px' }}
                          >
                            Raise Hand
                          </Button>
                        )}
                      </MessageContent>
                    </MessageContainer>
                  ))}
                </SimpleBar>
              ) : (
                filteredMessages.map((msg, index) => (
                  <MessageContainer key={index} user={msg.user}>
                    <AvatarContainer>
                      <Avatar icon={<UserOutlined />} />
                    </AvatarContainer>
                    <MessageContent
                      user={msg.user}
                      isQuestion={msg.isQuestion}
                      answered={msg.answered}
                      isAIWarning={msg.isAIWarning}
                      isAppreciation={msg.isAppreciation}
                    >
                      <strong>{msg.user}</strong>
                      <div onClick={() => handleReply(msg.text)}>
                        {msg.forwardedFrom && <div>(Forwarded from {msg.forwardedFrom})</div>}
                        {msg.text}
                      </div>
                      {msg.isQuestion && (
                        <Button
                          onClick={() => handleRaiseHand(msg.text)}
                          style={{ marginTop: '8px' }}
                        >
                          Raise Hand
                        </Button>
                      )}
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
                placeholder={replyTo ? `Replying to: ${replyTo}` : "Type your message..."}
                suffix={<SendOutlined onClick={sendMessage} />}
                style={{ flex: 1 }}
              />
            </InputContainer>
          </Content>
          <Sider width={500} className='canvas-sider'>
            <FullHeightCanvas>
              <h1>This chat is monitored by AI</h1>
              {memoizedCanvas}
            </FullHeightCanvas>
          </Sider>
        </Layout>
      </Layout>
    </Layout>
  );
};

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const MessageContainer = styled.div<{ user: string }>`
display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  flex-direction: ${(props) => (props.user === 'User' ? 'row-reverse' : 'row')};
  `;


const AvatarContainer = styled.div`
  margin-right: 8px;
`;

const MessageContent = styled.div<{
  user: string;
  isQuestion?: boolean;
  answered?: boolean;
  isAIWarning?: boolean;
  isAppreciation?: boolean;
}>`
  background: ${({ user }) => (user === 'AI' ? '#f6f8fa' : '#e6f7ff')};
 display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: ${(props) => (props.user === 'User' ? '0' : '8px')};
  margin-right: ${(props) => (props.user === 'User' ? '8px' : '0')};
  padding: 8px;
  border-radius: 16px;
  background: ${(props) => 
    props.isAIWarning ? 'red' : 
    props.isAppreciation ? 'green' :
    props.isQuestion ? '#428051' : '#fff'};
  color: ${(props) => 
    props.isAIWarning || props.isAppreciation || props.isQuestion ? '#fff' : 'black'};
  background-color:${(props)=>
    props.user === 'AI' ? '#90EE90' : '#fff'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  max-width: 60%;
  align-self: ${(props) => (props.user === 'User' ? 'flex-end' : 'flex-start')};
`;

const InputContainer = styled.div`
  display: flex;
  margin-top: 16px;
`;

const FullHeightCanvas = styled.div`
  width: 100%;
  height: 100%;
`;

const FullHeightContent = styled(Content)`
  width: 100%;
  height: 100vh;
`;

export default ChatRoom;
