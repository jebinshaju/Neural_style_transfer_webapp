
import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from '../ImageUpload';


import uploadAnimation from './tenor2.gif';

const StyleTransferForming = () => {
  const [contentImage, setContentImage] = useState(null);
  const [styleImage, setStyleImage] = useState(null);
  const [epochs, setEpochs] = useState(1);
  const [stepsPerEpoch, setStepsPerEpoch] = useState(5);
  const [contentBrightness, setContentBrightness] = useState(0);
  const [contentContrast, setContentContrast] = useState(0);
  const [styleBrightness, setStyleBrightness] = useState(0);
  const [styleContrast, setStyleContrast] = useState(0);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // State to hold upload progress
  const [showUploadAnimation, setShowUploadAnimation] = useState(false);

  const handleTransferStyle = async () => {
    setUploading(true);
    setShowUploadAnimation(true); // Trigger animation
    const formData = new FormData();
    formData.append('content', contentImage);
    formData.append('style', styleImage);
    formData.append('epochs', epochs);
    formData.append('steps_per_epoch', stepsPerEpoch);
    formData.append('content_brightness', contentBrightness);
    formData.append('content_contrast', contentContrast);
    formData.append('style_brightness', styleBrightness);
    formData.append('style_contrast', styleContrast);

    try {
      const response = await axios.post('http://localhost:5000/transfer_style_logged_out', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress); // Update upload progress state
        },
      });
      setGeneratedImage(response.data.generated_image);
    } catch (error) {
      console.error('Error transferring style:', error);
    } finally {
      setUploading(false);
      setShowUploadAnimation(false); // Hide animation after upload
    }
  };

  return (
    <div className="style-transfer-form">
      <h2 style={{ padding: "40px" }} id="r1">NEURAL STYLE TRANSFER</h2>
      <div className="upload-section">
        <ImageUpload
          label="Content Image"
          setImage={setContentImage}
          brightness={contentBrightness}
          setBrightness={setContentBrightness}
          contrast={contentContrast}
          setContrast={setContentContrast}
        />
        {showUploadAnimation && (
          <div className="loaderx">
          </div>
        )}
        <ImageUpload
          label="Style Image"
          setImage={setStyleImage}
          brightness={styleBrightness}
          setBrightness={setStyleBrightness}
          contrast={styleContrast}
          setContrast={setStyleContrast}
        />
      </div>
      <div className="slider-section">
        <label htmlFor="epochs">Epochs: {epochs}</label>
        <input type="range" id="epochs" min={1} max={10} value={epochs} onChange={(e) => setEpochs(e.target.value)} />
        <label htmlFor="stepsPerEpoch">Steps per Epoch: {stepsPerEpoch}</label>
        <input
          type="range"
          id="stepsPerEpoch"
          min={5}
          max={20}
          value={stepsPerEpoch}
          onChange={(e) => setStepsPerEpoch(e.target.value)}
        />
      </div>
      <button className="transfer-btn" onClick={handleTransferStyle} disabled={!contentImage || !styleImage || uploading}>
        {uploading ? 'Uploading...' : 'Transfer Style'}
      </button>
      {uploading && <progress value={uploadProgress} max="100"></progress>} {/* Display progress bar */}
      {generatedImage && (
        <div className="generated-image">
          <h3 style={{ margin: "20px" }}>GENERATED IMAGE</h3>
          <img src={`http://localhost:5000/generated_image/${generatedImage}`} alt="Generated" className="genz" />
          <a href={`http://localhost:5000/generated_image/${generatedImage}`} download>Download Image</a>
        </div>
      )}
    </div>
  );
};
export default StyleTransferForming;
