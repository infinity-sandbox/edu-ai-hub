import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/mainPageStyle/index.css';
import Logo from "../../images/logo.svg";
import babeWithPc from '../../images/OEMBZ20.jpg'
import robot from '../../images/robot.svg'
import chat from '../../images/chat.svg'
import HomePage from '../../images/HomePage.svg'
import performance from '../../images/performance.svg'
import ProfileManagement from '../../images/ProfileManagement.svg'

interface HomeProps {
  username: string;
}

const Home: React.FC<HomeProps> = ({ username }) => {
  const { t } = useTranslation();
    const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 3000); // Start the fade-in effect almost immediately

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div className='homeWithImage'>
      <div className="insideHome-container">

        <div className={`center-content ${fadeIn ? 'fade-in' : ''}`}>
          <h1 className="welcome-message">{t('index.Welcome to the Home Page')}</h1>
          <img src={Logo} alt="Logo" />
        </div>
        <div className="button-container">
          <figure className="circle-button">
            <img src={robot}  alt="Button Icon" />
            <figcaption>AI class</figcaption>
          </figure>
           <figure className="circle-button">
            <img src={chat}  alt="Button Icon" />
            <figcaption>ChatRoom</figcaption>
          </figure>
           <figure className="circle-button">
            <img src={HomePage}  alt="Button Icon" />
            <figcaption>chat</figcaption>
          </figure>
           <figure className="circle-button">
            <img src={performance}  alt="Button Icon" />
            <figcaption>Performance</figcaption>
          </figure>
          <figure className="circle-button">
            <img src={ProfileManagement}  alt="Button Icon" />
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
