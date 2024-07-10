import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/SideNav/Sidebar';
import ProfileManagement from '../components/ProfileManagements/ProfileManagement';
import '../styles/ViewProfile.css';

const { Content } = Layout;

const ViewProfile: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState('home');

  const handleNavSelect = (key: string) => {
    setSelectedPage(key);
  };

  const renderContent = () => {
    switch (selectedPage) {
      case 'manage-profile':
        return <ProfileManagement />;
      default:
        return <ProfileManagement />;
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
