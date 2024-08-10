import React, { useState, useEffect } from "react";
import Logo from "../../images/AI BOU Logo - Original with Transparent Background - 5000x5000.png";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/LandingPage.css";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    navigate('/login');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar-links-container') && !target.closest('.navbar-menu-container')) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const menuOptions = [
    { text: t('navbar.home'), link: '#home' },
    { text: t('navbar.about'), link: '#about' },
    { text: t('navbar.contact'), link: '#contact' },
  ];

  return (
    <>
      <nav>
        <div className="nav-logo-container">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="navbar-menu-container" onClick={handleMenuToggle}>
          <HiOutlineBars3 />
        </div>
        <div className={`navbar-links-container ${isMenuOpen ? 'open' : ''}`}>
          {menuOptions.map((item) => (
            <a key={item.text} href={item.link}>{item.text}</a>
          ))}
          <button className="primary-button" onClick={handleClick}>{t('navbar.login_button')}</button>
        </div>
        {isMenuOpen && <div className="overlay" onClick={handleMenuToggle}></div>}
      </nav>
    </>
  );
};

export default Navbar;