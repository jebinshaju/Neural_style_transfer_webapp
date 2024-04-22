// AdjustBrightnessContrast.js

import React from 'react';
import './AdjustBrightnessContrast.css';

const AdjustBrightnessContrast = ({ brightness, setBrightness, contrast, setContrast }) => {
  const handleBrightnessChange = (e) => {
    setBrightness(e.target.value);
  };

  const handleContrastChange = (e) => {
    setContrast(e.target.value);
  };

  return (
    <div className="adjust-brightness-contrast">
      <label htmlFor="brightness">Brightness: {brightness}</label>
      <input
        type="range"
        id="brightness"
        min={-100}
        max={100}
        value={brightness}
        onChange={handleBrightnessChange}
      />
      <label htmlFor="contrast">Contrast: {contrast}</label>
      <input type="range" id="contrast" min={-100} max={100} value={contrast} onChange={handleContrastChange} />
    </div>
  );
};

export default AdjustBrightnessContrast;
