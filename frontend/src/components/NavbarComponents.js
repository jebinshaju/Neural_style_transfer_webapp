import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const NavbarComponent = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [hoverColor, setHoverColor] = useState('rgb(205, 171, 223)')
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    const header = document.getElementById("header");

    const handleScroll = () => {
      if (window.scrollY > 100) { // Adjust the threshold as needed
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigate = (route) => {
    navigate(route);
  };

  // Function to generate random color
  const getRandomColor = () => {
    const letters = '89ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  return (
    <header id="header" className={isFixed ? 'fixed' : ''} style={{ backgroundColor: hoverColor }}>
      <div id="nav-navigation" onClick={toggleNav}>
        {/* Your navigation buttons */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide lucide-chevron-right icon ${
            isNavOpen ? 'rotate-left' : ''
          }`}
        >
          <path d="m9 18 6-6-6-6" element-id="112" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide lucide-chevron-left icon ${
            isNavOpen ? 'rotate-right' : ''
          }`}
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </div>
      <div id="nav-actions">
        {/* Your navigation buttons */}
        <button className="nav-button" onMouseEnter={() => setHoverColor(getRandomColor())} onClick={() => handleNavigate('/styletransfering')}>Style Transfer</button>
        <button className="nav-button" onMouseEnter={() => setHoverColor(getRandomColor())} onClick={() => handleNavigate('/login')}>Login</button>
        <button className="nav-button" onMouseEnter={() => setHoverColor(getRandomColor())} onClick={() => handleNavigate('/signup')}>Signup</button>
      </div>
    </header>
  );
};

export default NavbarComponent;
