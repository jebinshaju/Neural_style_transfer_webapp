import React, { useEffect } from 'react';

const ScrollingEffectComponent = ({ currentPage }) => {
  useEffect(() => {
    const sections = document.querySelectorAll('section');

    const scrollToSection = (sectionIndex) => {
      const section = sections[sectionIndex];
      const top = section.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    const handleScrollEvent = (event) => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const bottomThreshold = documentHeight - windowHeight;

      if (currentPage === 1 && scrollPosition >= bottomThreshold * 0.75) {
        scrollToSection(1);
      }
    };

    window.addEventListener('scroll', handleScrollEvent);

    return () => {
      window.removeEventListener('scroll', handleScrollEvent);
    };
  }, [currentPage]); 

  return null;
};

export default ScrollingEffectComponent;
