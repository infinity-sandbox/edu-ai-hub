import React, { ReactNode } from 'react';
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';
import '../styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <LanguageSwitcher />
      {children}
    </div>
  );
};

export default Layout;
