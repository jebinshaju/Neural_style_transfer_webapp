// ImageUpload.js

import React, { useState, useEffect } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ label, setImage }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [brightness, setBrightness] = useState(0); // Initial brightness level
  const [contrast, setContrast] = useState(0); // Initial contrast level
  const [adjustedImage, setAdjustedImage] = useState(null); // Adjusted image URL

  useEffect(() => { //Activates when any ne f the dependencies changes and cak
    if (uploadedImage) {
      applyFiltersToImage();
    }
  }, [brightness, contrast, uploadedImage]); // Update image when brightness, contrast, or uploaded image changes

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setImage(image);
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      setUploadedImage(imageUrl);
      setAdjustedImage(imageUrl); // Set initial adjusted image URL
    }
  };

  const applyFiltersToImage = () => {
    const img = new Image();
    img.src = uploadedImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      // Mapping the brightness and contrast values to the range expected by CSS filters
      const adjustedBrightness = (brightness + 3) * 100 / 3; // Map [-3, 3] to [0, 200]
      const adjustedContrast = (contrast + 3) * 100 / 3; // Map [-3, 3] to [0, 200]

      ctx.filter = `brightness(${adjustedBrightness}%) contrast(${adjustedContrast}%)`; // Apply brightness and contrast
      ctx.drawImage(img, 0, 0);

      // Convert canvas content back to a blob
      canvas.toBlob((blob) => {
        // Create a new file from the blob
        const adjustedImageFile = new File([blob], "adjusted-image.png", { type: "image/png" });
        // Update the original uploaded image
        setImage(adjustedImageFile);
      }, "image/png");

      // Create a data URL for displaying the adjusted image
      const imageUrl = canvas.toDataURL();
      setAdjustedImage(imageUrl); // Update adjusted image URL
    };
  };

  return (
    <div className="image-upload">
      <label htmlFor="imageInput" className="upload-label">
        {adjustedImage ? ( // Render adjusted image if available
          <img src={adjustedImage} alt="Uploaded" className="uploaded-image" />
        ) : (
          <div className="upload-box">
            <i className="fas fa-upload"></i>
            <p>{`Upload ${label}`}</p>
          </div>
        )}
      </label>
      <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} />
      <div className="adjust-brightness-contrast">
        <label htmlFor="brightness">Brightness: {brightness}</label>
        <input
          type="range"
          id="brightness"
          min={-3}
          max={3}
          value={brightness}
          onChange={(e) => setBrightness(parseInt(e.target.value))}
        />
        <label htmlFor="contrast">Contrast: {contrast}</label>
        <input
          type="range"
          id="contrast"
          min={-3}
          max={3}
          value={contrast}
          onChange={(e) => setContrast(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
