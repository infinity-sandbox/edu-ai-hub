import React from 'react';
import { Layout, Menu, Dropdown, Button } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import '../../styles/Sidebar.css';

const { Sider } = Layout;

interface SidebarProps {
  onSelect: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const profileMenu = (
    <Menu>
      <Menu.Item key="manage-profile" onClick={() => onSelect('manage-profile')}>
        Manage Profile
      </Menu.Item>
      <Menu.Item key="settings" onClick={() => onSelect('settings')}>
        Settings
      </Menu.Item>
      <Menu.Item key="sign-out" onClick={() => onSelect('sign-out')}>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Sider width={200} className="site-layout-background">
      <Menu
      className='sidebarMenu'
        mode="inline"
        defaultSelectedKeys={['home']}
        style={{ height: '100%', borderRight: 0 }}
        onClick={({ key }) => onSelect(key)}
      >
        <Menu.Item key="home">Home</Menu.Item>
        <Menu.Item key="aibot-class">AIBot Class</Menu.Item>
        <Menu.Item key="chat">Chat</Menu.Item>
        <Menu.Item key="performance">Performance</Menu.Item>
        <Menu.Item key="games">Games</Menu.Item>
        <Menu.Item key="notifications">Notifications</Menu.Item>
        <Menu.Item key="profile" onClick={() => onSelect('manage-profile')}>
         
              Profile
          
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
