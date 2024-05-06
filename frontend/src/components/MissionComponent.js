import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Mission.module.css'; // Import with '.module.css' extension
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
  <section className={`${styles.mission} ${isVisible ? styles.mission__visible : ''}`} ref={missionRef}>
   <div className={styles.mission__content}>
    <h3 id="ck" className={isVisible ? styles.mission__h3 : ''}>CHECKOUT OUR WORKS!</h3>
    <hr />
    <div className={styles.mission__rectangle}>
     <div className={styles.mission__image__containers}>
      <img src={img1} alt="Description" className={styles.mission__image} />
      <img src={img2} alt="Description" className={isVisible ? styles.mission__image : styles.mission__image__slideIn} />
      <img src={img3} alt="Description" className={isVisible ? styles.mission__image : styles.mission__image__slideIn} />
      <img src={img4} alt="Description" className={isVisible ? styles.mission__image : styles.mission__image__slideIn} />
      <img src={img4} alt="Description" className={isVisible ? styles.mission__image : styles.mission__image__slideIn} />
      <img src={img4} alt="Description" className={isVisible ? styles.mission__image : styles.mission__image__slideIn} />
      <img src={img4} alt="Description" className={isVisible ? styles.mission__image : styles.mission__image__slideIn} />
      <img src={img4} alt="Description" className={isVisible ? styles.mission__image : styles.mission__image__slideIn} />
     </div>
    </div>
    <div className={styles.mission__buttonContainer}>
     <button className={styles.mission__tryOutButton} onClick={handleButtonClick}>TRY OUT NOW!</button>
    </div>
   </div>
  </section>
 );
};

export default MissionComponent;
