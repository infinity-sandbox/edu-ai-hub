import React from 'react';
import About from '../components/landingPage/About'
import Contact from '../components/landingPage/Contact'
import Footer from '../components/landingPage/Footer'
import Home from '../components/landingPage/Home'
import Navbar from '../components/landingPage/Navbar'
import Testimonial from '../components/landingPage/Testimonial'
import Work from '../components/landingPage/Work'

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <Home />
      <About />
      <Work />
      {/* <Testimonial /> */}
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;