import React, { useEffect, useRef, useState } from 'react';
import './Quote.css';
import Image1 from './in.jpg';
import Image2 from './style.jpg';
import Image3 from './out.png';

const QuoteComponent = () => {
  const quotesRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 } 
    );

    if (quotesRef.current) {
      observer.observe(quotesRef.current);
    }

    return () => {
      if (quotesRef.current) {
        observer.unobserve(quotesRef.current);
      }
    };
  }, []);

  return (
    <section className={`quotes ${isVisible ? 'visible' : ''}`} ref={quotesRef}>
      <div className={`content ${isVisible ? 'animate' : ''}`}>
        <h2 className="heading">HOW IT WORKS?</h2>
        <p className="description">
          Neural style transfer is a fascinating technique in computer vision that allows us to merge the content of one
          image with the artistic style of another. It's achieved by using deep neural networks to analyze and manipulate
          the visual content of images. By separating and recombining content and style features, neural style transfer
          can generate visually appealing and creative artworks.
        </p>

        <hr />
        <br />
      </div>
      <div className={`image-container ${isVisible ? 'animate' : ''}`}>
        <div className="rows">
          <div className="image-box">
            <img src={Image1} alt="Image 1" className="image" />
          </div>
          <div className="operation">
            <div className="symbol">+</div>
          </div>
          <div className="image-box">
            <img src={Image2} alt="Image 2" className="image" />
          </div>
        </div>
        <div className="equal">
          <div className="symbol">=</div>
        </div>
        <div className="rows">
          <div className="image-box">
            <img src={Image3} alt="Image 3" className="image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteComponent;
