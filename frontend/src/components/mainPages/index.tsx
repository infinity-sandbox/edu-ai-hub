import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/mainPageStyle/index.css';
import Logo from "../../images/logo.svg";

interface HomeProps {
  username: string;
}

const Home: React.FC<HomeProps> = ({ username}) => {
  const { t } = useTranslation();

  return (
    <div className="insideHome-container">
      <h1 className="welcome-message">{t('index.Welcome to the Home Page')}</h1>
       <img src={Logo} alt="" />
    </div>
  );
};

export default Home;
