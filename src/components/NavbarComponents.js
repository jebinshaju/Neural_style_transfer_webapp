import React, { useState, useRef } from 'react';
import './Navbar.css';
import { FaBars, FaTimes } from 'react-icons/fa';

const NavbarComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navbarRef = useRef(null);

  const toggleNavbar = () => {
    setIsVisible(!isVisible);
  };

  const navbarStyle = {
    position: 'fixed',
    top: 0,
    right: isVisible ? '0' : '-250px',
    height: '95vh',
    width: '250px',
    backgroundColor: '#fff',
    transition: 'right 0.2s ease-in-out',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    zIndex: 999,
    borderRadius: '30px',
    background: 'linear-gradient(45deg, violet, white)'

  };

  return (
    <div className="navbar-container">
      <button className="toggle-btn" onClick={toggleNavbar}>
        {isVisible ? <FaTimes /> : <FaBars />}
        <span className="menu-text">M E N U</span>
      </button>
      <nav ref={navbarRef} style={navbarStyle} className={`navbar ${isVisible ? 'visible' : ''}`}>
        <FaTimes className="close-icon" onClick={toggleNavbar} />
        <ul>
          <li><a href="/styletransfer">Style Transfer</a></li>
          <li><a href="login">Login</a></li>
          <li><a href="/signup">Signup</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default NavbarComponent;
