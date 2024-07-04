import React from "react";
import BannerBackground from "../../images/home-banner-background-green.svg";
import BannerImage from "../../images/cartoon-boy-student-stands-and-reading-a-book-free-vector_processed.jpg.svg";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import '../../styles/LandingPage.css';
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
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
            Your Favorite Learning Adventures with AI
          </h1>
          <p className="primary-text">
          Explore interactive experiences that spark curiosity and creativity for kids, 
          blending fun with educational insights.
          </p>
          <button className="secondary-button" onClick={handleClick}>
            Register <FiArrowRight />{" "}
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
