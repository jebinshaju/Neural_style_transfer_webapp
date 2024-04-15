import React, { useState, useEffect } from 'react';
import './App.css'; // Import global styles
import { Routes, Route, useLocation } from "react-router-dom";
import LoginComponent from './Login';
import SignUpForm from './SignUP';
import StyleTransferForm from './Styletransfer';
import NavbarComponent from './components/NavbarComponents';
import HeroComponent from './components/HeroComponent';
import ScrollingEffectComponent from './components/ScrollingEffectComponent';
import QuoteComponent from './components/QuoteComponent';
import MissionComponent from './components/MissionComponent';
import Profile from './components/profile';
import StyleTransferForming from './components/StyleTransW'

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const triggerPoint = document.documentElement.clientHeight * 0.75;

    if (scrollPosition > triggerPoint && currentPage === 1) {
      setCurrentPage(2);
    } else if (scrollPosition > document.documentElement.scrollHeight - window.innerHeight && currentPage === 2) {
      setCurrentPage(3);
    }
  };


  useEffect(() => {
    if (currentPage === 1 && location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [currentPage, location.pathname]);


  useEffect(() => {
    setCurrentPage(1);
  }, [location]);

  return (
    <div className="App">

      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/styletransfer" element={<StyleTransferForm />} />
        <Route path="/" element={<HeroComponent />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/styletransfering' element={<StyleTransferForming />} />
      </Routes>
      {location.pathname === '/' && <ScrollingEffectComponent currentPage={currentPage} />}
      {location.pathname === '/' && (
        <>
          <section id="page-2">
            <QuoteComponent />
          </section>
          <section id="page-3">
            <MissionComponent />
          </section>
        </>
      )}
    </div>
  );
}

export default App;
