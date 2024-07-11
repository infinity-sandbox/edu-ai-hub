import React, { useState } from 'react';
import { Layout, Menu, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import '../../styles/Sidebar.css';
import { useTranslation } from 'react-i18next';

const { Sider } = Layout;

interface SidebarProps {
  onSelect: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const { t } = useTranslation();
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
      <Menu.Item key="home">{t('Sidebar.Home')}</Menu.Item>
      <Menu.Item key="aibot-class">{t('Sidebar.aibot_class')}</Menu.Item>
      <Menu.Item key="chat">{t('Sidebar.chat')}</Menu.Item>
      <Menu.Item key="performance">{t('Sidebar.performance')}</Menu.Item>
      <Menu.Item key="games">{t('Sidebar.games')}</Menu.Item>
      <Menu.Item key="notifications">{t('Sidebar.notifications')}</Menu.Item>
      <Menu.Item key="manage-profile">{t('Sidebar.manage_profile')}</Menu.Item>
      <Menu.Item key="sign-out">{t('Sidebar.sign_out')}</Menu.Item>
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
        title={t('Sidebar.Menu')}
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
