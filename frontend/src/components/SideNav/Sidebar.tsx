import React, { useState } from 'react';
import { Layout, Menu, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import '../../styles/Sidebar.css';

const { Sider } = Layout;

interface SidebarProps {
  onSelect: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    onSelect(key);
    onClose();
  };

  const menu = (
    <Menu
    className='sidebarMenu'
      mode="inline"
      defaultSelectedKeys={['home']}
      style={{ height: '100%', borderRight: 0 }}
      onClick={handleMenuClick}
    >
      <Menu.Item key="home">Home</Menu.Item>
      <Menu.Item key="aibot-class">AIBot Class</Menu.Item>
      <Menu.Item key="chat">Chat</Menu.Item>
      <Menu.Item key="performance">Performance</Menu.Item>
      <Menu.Item key="games">Games</Menu.Item>
      <Menu.Item key="notifications">Notifications</Menu.Item>
      <Menu.Item key="manage-profile">Profile Managegnent</Menu.Item>
      <Menu.Item key="sign-out">Sign Out</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Button className="menu-button" type="primary" onClick={showDrawer}>
        <MenuOutlined />
      </Button>
      <Sider className="site-layout-background sider-desktop">
        {menu}
      </Sider>
      <Drawer
        title="Menu"
        placement="left"
        closable={false}
        onClose={onClose}
        visible={visible}
        className="drawer-mobile"
      >
        {menu}
      </Drawer>
    </>
  );
};

export default Sidebar;
