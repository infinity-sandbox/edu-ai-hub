import React from 'react';
import AboutBackground from "../../images/about-background.svg";
import AboutBackgroundImage from "../../images/WhatsApp-Image-2024-07-01-at-18_25_52_processed.svg";
// import { BsFillPlayCircleFill } from "react-icons/bs";
import '../../styles/LandingPage.css';

const About: React.FC = () => {
    return (
        <div className="about-section-container">
          <div className="about-background-image-container">
            <img src={AboutBackground} alt="" />
          </div>
          <div className="about-section-image-container">
            <img src={AboutBackgroundImage} alt="" />
          </div>
          <div className="about-section-text-container">
            <p className="primary-subheading">About</p>
            <h1 className="primary-heading">
              Unlocking the Future of Learning with AI
            </h1>
            <p className="primary-text">
            Our platform leverages the power of AI to create personalized, engaging, and 
            effective learning experiences for children. We blend fun with education, 
            fostering a love for learning and developing critical thinking skills.
            </p>
            <p className="primary-text">
                Our AI-driven approach ensures that each child receives tailored lessons 
                that adapt to their unique learning style and pace, making education more 
                accessible and enjoyable.
            </p>
            <div className="about-buttons-container">
              <button className="secondary-button">Learn More</button>
              {/* <button className="watch-video-button">
                <BsFillPlayCircleFill /> Watch Video
              </button> */}
            </div>
          </div>
        </div>
      );
};
        
export default About;
