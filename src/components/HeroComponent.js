// HeroComponent.js
import React, { useState, useEffect } from 'react';
import './Hero.css';
import NavbarComponent from './NavbarComponents';

const HeroComponent = () => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  useEffect(() => {
    const animateText = () => {
      const textContainer = document.querySelector('.text-container');
      const quote = document.querySelector('.quote');
      textContainer.classList.add('appear');
      quote.classList.add('appear');
    };

    animateText();
  }, []);

  const handleScrollDown = () => {
    window.scroll({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="hero">
      <div className="outer-box">
        <NavbarComponent isVisible={isNavbarVisible} />
        <div className="inner-box">
          <div className="text-container">
            <p className="paragraph">NEURAL STYLE TRANSFER</p>
            <p className="quote">"Where art meets algorithms, and pixels dance to the rhythm of creativity"</p>
          </div>
        </div>
        <div className="scroll-indicator" onClick={handleScrollDown}>
          <p className="scroll-text" style={{cursor: 'pointer'}}>SCROLL DOWN</p>
          <div className="arrow-down"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroComponent;
