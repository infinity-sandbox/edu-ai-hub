import React, { useState } from 'react';
import { Drawer, Button, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import '../../styles/Sidebar.css';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  handleNavigation: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handleNavigation }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    handleNavigation(key);
    onClose();
  };

  const menu = (
    <Menu
      className="sidebar-menu"
      mode="inline"
      defaultSelectedKeys={['home']}
      onClick={handleMenuClick}
    >
      <Menu.Item key="/home">{t('Sidebar.Home')}</Menu.Item>
      <Menu.Item key="/aibot-class">{t('Sidebar.aibot_class')}</Menu.Item>
      <Menu.Item key="/chat">{t('Sidebar.chat')}</Menu.Item>
      <Menu.Item key="/performance">{t('Sidebar.performance')}</Menu.Item>
      <Menu.Item key="/games">{t('Sidebar.games')}</Menu.Item>
      <Menu.Item key="/notifications">{t('Sidebar.notifications')}</Menu.Item>
      <Menu.Item key="/manage-profile">{t('Sidebar.manage_profile')}</Menu.Item>
      <Menu.Item key="/sign-out">{t('Sidebar.sign_out')}</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Button className="menu-button" type="primary" onClick={showDrawer}>
        <MenuOutlined />
      </Button>
      <Drawer
        title={<span className="drawer-title">{t('Sidebar.menu')}</span>}
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
