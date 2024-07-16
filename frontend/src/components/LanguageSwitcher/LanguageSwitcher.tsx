import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Dropdown } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import '../../styles/LanguageSwitcher/LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => changeLanguage('en')}>
        <span role="img" aria-label="English">
          🇬🇧
        </span> English
      </Menu.Item>
      <Menu.Item key="2" onClick={() => changeLanguage('zh')}>
        <span role="img" aria-label="Chinese">
          🇨🇳
        </span> Chinese
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown className='laguageMenu' overlay={menu} trigger={['click']}>
      <GlobalOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
    </Dropdown>
  );
};

export default LanguageSwitcher;
