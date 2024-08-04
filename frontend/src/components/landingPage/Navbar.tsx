/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Logo from "../../images/logo.svg";
import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/LandingPage.css"

const Navbar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    navigate('/login');
  };

  const menuOptions = [
    {
      text: t('navbar.home'),
      icon: <HomeIcon />,
    },
    {
      text: t('navbar.about'),
      icon: <InfoIcon />,
    },
    {
      text: t('navbar.testimonials'),
      icon: <CommentRoundedIcon />,
    },
    {
      text: t('navbar.contact'),
      icon: <PhoneRoundedIcon />,
    },
    {
      text: t('navbar.cart'),
      icon: <ShoppingCartRoundedIcon />,
    },
  ];

  return (
    <nav>
      <div className="nav-logo-container">
        <img src={Logo} alt="" />
      </div>
      <div className="navbar-links-container">
        <a href="#home">{t('navbar.home')}</a>
        <a href="#about">{t('navbar.about')}</a>
        {/* <a href="#testimonials">{t('navbar.testimonials')}</a> */}
        <a href="#contact">{t('navbar.contact')}</a>
        <a href="">
          {/* <BsCart2 className="navbar-cart-icon" /> */}
        </a>
        <button className="primary-button" onClick={handleClick}>{t('navbar.login_button')}</button>
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        {/* <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box> */}
      </Drawer>
    </nav>
  );
};

export default Navbar;
