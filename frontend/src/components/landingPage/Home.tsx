import React from "react";
import BannerBackground from "../../images/home-banner-background-green.svg";
import BannerImage from "../../images/cartoon-boy-student-stands-and-reading-a-book-free-vector_processed.jpg.svg";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import '../../styles/LandingPage.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/Register');
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            {t('home.primary_heading')}
          </h1>
          <p className="primary-text">
            {t('home.primary_text')}
          </p>
          <button className="secondary-button" onClick={handleClick}>
            {t('home.register_button')} <FiArrowRight />{" "}
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
