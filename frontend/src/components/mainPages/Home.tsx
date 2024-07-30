import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/mainPageStyle/Home.css';
import babeWithPc from '../../images/OEMBZ20.png';
import robot from '../../images/robot.svg';
import chat from '../../images/chat.svg';
import HomePage from '../../images/HomePage.svg';
import performance from '../../images/performance.svg';
import ProfileManagement from '../../images/ProfileManagement.svg';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Sidebar from '../SideNav/Sidebar';


const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [fadeIn, setFadeIn] = useState(false);
  const handleNavigation = (path: string) => {
    navigate(path); // Navigate to the specified path
  };
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 1000); // Start the fade-in effect almost immediately

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div className='homeWithImage'>
      <Sidebar handleNavigation={handleNavigation} />
      <div className={`insideHome-container fade ${fadeIn ? 'show' : ''}`}>
        <div className="button-container" >
          <figure className="circle-button" onClick={() => handleNavigation('/aibot-class')}>
            <img src={robot} alt="Button Icon" />
            <figcaption>AI class</figcaption>
          </figure>
          <figure className="circle-button" onClick={() => handleNavigation('/chatRoom')}>
            <img src={chat} alt="Button Icon" />
            <figcaption>ChatRoom</figcaption>
          </figure>
          <figure className="circle-button" onClick={() => handleNavigation('/home')}>
            <img src={HomePage} alt="Button Icon" />
            <figcaption>Home</figcaption>
          </figure>
          <figure className="circle-button" onClick={() => handleNavigation('/performance')}>
            <img src={performance} alt="Button Icon" />
            <figcaption>Performance</figcaption>
          </figure>
          <figure className="circle-button" onClick={() => handleNavigation('/profile-management')}>
            <img src={ProfileManagement} alt="Button Icon" />
            <figcaption>Manage Profile</figcaption>
          </figure>
        </div>
      </div>
      <div>
        <img className="babe" src={babeWithPc} alt="Babe with PC" />
      </div>
    </div>
  );
};

export default Home;
