// MissionComponent.js

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Mission.css';
import img1 from './img1.jpg';
import img2 from './img2.jpg';
import img3 from './img3.jpg';
import img4 from './img4.jpg';

const MissionComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const missionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (missionRef.current) {
      observer.observe(missionRef.current);
    }

    return () => {
      if (missionRef.current) {
        observer.unobserve(missionRef.current);
      }
    };
  }, []);

  const handleButtonClick = () => {
    navigate('./styletransfering');
  };

  return (
    <section className={`mission ${isVisible ? 'visible' : ''}`} ref={missionRef}>
      <div className="mission-content">
        <h3 id="ck" className={isVisible ? 'slide-in' : ''}>CHECKOUT OUR WORKS!</h3>
        <hr />
        <div className="rectangle">
          <div className="image-containers">
            <img src={img1} alt="Description" className={isVisible ? 'slide-in' : ''}/>
            <img src={img2} alt="Description" className={isVisible ? 'slide-in' : ''}/>
            <img src={img3} alt="Description" className={isVisible ? 'slide-in' : ''}/>
            <img src={img4} alt="Description" className={isVisible ? 'slide-in' : ''}/>
          </div>
        </div>
        <div className="button-container">
          <button className="try-out-button" onClick={handleButtonClick}>TRY OUT NOW!</button>
        </div>
      </div>
    </section>
  );
};

export default MissionComponent;
