import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';
import Sidebar from './SideNav/Sidebar'; // Import Sidebar component

// Define the type for props including children
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation(); // Get the current location

  // Define a list of paths where the Sidebar should be shown
  const pathsWithSidebar = ['/home', '/aibot-class', '/chat', '/performance', '/games'];

  // Check if the current path should display the Sidebar
  const showSidebar = pathsWithSidebar.includes(location.pathname);

  return (
    <div>
      {showSidebar && <Sidebar />} {/* Conditionally render Sidebar */}
      <LanguageSwitcher />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;