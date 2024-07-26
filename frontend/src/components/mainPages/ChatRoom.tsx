import React, { useState, useEffect } from 'react';
import { Input, List, Avatar, Button, Layout, Typography } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import '../../styles/mainPageStyle/ChatRoom.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const socket = io('http://127.0.0.1:8000'); // Replace with your backend socket URL

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);

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

  return (
    <Layout className='chat-room'>
      <Header className='chat-header'>
        <Title style={{ color: 'white' }} level={3}>Chat Room</Title>
        <Button type="primary" danger onClick={() => setIsOnline(false)} style={{ float: 'right' }}>Do Not Disturb</Button>
      </Header>
      <Layout>
        <Sider width={200} className="site">
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.user}
                  description={item.text}
                />
              </List.Item>
            )}
          />
        </Sider>
        <Content className='chat-content' style={{ padding: '0 24px', minHeight: 280 }}>
          <ChatContainer>
            {messages.map((msg, index) => (
              <Message className='message' key={index}>
                <Avatar icon={<UserOutlined />} />
                <MessageContent className='message-content'>
                  <strong>{msg.user}:</strong> {msg.text}
                </MessageContent>
              </Message>
            ))}
          </ChatContainer>
          <InputContainer className='input-container'>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onPressEnter={sendMessage}
              placeholder="Type your message..."
              suffix={<SendOutlined onClick={sendMessage} />}
            />
          </InputContainer>
        </Content>
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
  background: #59B379
  border-radius: 8px;
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const MessageContent = styled.div`
  background: #59B379;
  padding: 8px;
  border-radius: 8px;
  margin-left: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: ##59B379;
  border-top: 1px solid #f0f0f0;
`;

export default ChatRoom;
