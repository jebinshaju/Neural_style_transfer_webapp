import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import ImageUpload from './ImageUpload';
import './Styletransfer.css';
import loginIcon from './components/icon.png';

const StyleTransferForm = () => {
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadAnimation, setShowUploadAnimation] = useState(false);

  const navigate = useNavigate(); // Get the navigate function
  useEffect(() => {
   const checkSession = async () => {
     try {
       const response = await axios.get('https://nstapi.politeriver-d3fc4f5c.centralindia.azurecontainerapps.io/session_check');
       if (!response.data.success) {
         navigate('/login');
       }
     } catch (error) {
       console.error('Error checking session:', error);
     }
   };

   checkSession();
 }, [navigate]);

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
      const response = await axios.post('https://nstapi.politeriver-d3fc4f5c.centralindia.azurecontainerapps.io/transfer_style', formData, {
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
  const handleSignout = async () => {
    try {
      // Assuming you have a signout endpoint in your backend
      await axios.get('https://nstapi.politeriver-d3fc4f5c.centralindia.azurecontainerapps.io/signout');
      navigate('/login'); // Navigate to the login page after successful signout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="style-transfer-form">
      <div className="login-icon-container">
        <Link to="/profile">
          <img src={loginIcon} alt="Login" className="login-icon" />
        </Link>
      </div>
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
      {uploading && <progress value={uploadProgress} max="100"></progress>}
      {generatedImage && (
        <div className="generated-image">
          <h3 style={{ margin: "20px" }}>GENERATED IMAGE</h3>
          <img src={`https://nstapi.politeriver-d3fc4f5c.centralindia.azurecontainerapps.io/generated_image/${generatedImage}`} alt="Generated" className="genz" />
          <a href={`https://nstapi.politeriver-d3fc4f5c.centralindia.azurecontainerapps.io/generated_image/${generatedImage}`} download>Download Image</a>
        </div>
      )}
      <button className="signout-btn" onClick={handleSignout}>
        Sign Out
      </button>
    </div>
  );
};

export default StyleTransferForm;
