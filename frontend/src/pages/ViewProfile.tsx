import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/SideNav/Sidebar';
import ProfileManagement from '../components/ProfileManagements/ProfileManagement';
import '../styles/ViewProfile.css';
import AIBotInteraction from '../components/mainPages/AIBotInteraction';

const { Content } = Layout;

const ViewProfile: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState('home');

  const handleNavSelect = (key: string) => {
    if (key === 'sign-out') {
      handleSignOut();
    } else {
      setSelectedPage(key);
    }
  };

 const handleSignOut = async () => {
  console.log('Signing out...');
  try {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // if you're using cookies for session
    });
    window.location.href = '/login';
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

  const renderContent = () => {
    switch (selectedPage) {
      case 'manage-profile':
        return <ProfileManagement />;
      case 'aibot-class':
        return <AIBotInteraction/>
      default:
        return <div>Welcome to the {selectedPage} page!</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar onSelect={handleNavSelect} />
      <Layout>
        <Content style={{ padding: '24px', minHeight: '280px' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ViewProfile;
