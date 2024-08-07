import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import loginIcon from './components/icon.png';
import './Styletransfer.css';

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
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const checkSessionResponse = await axios.get('http://localhost:5000/session_check');
        const isAuthenticated = checkSessionResponse.data.success;

        if (!isAuthenticated) {
          navigate('/login');
        } else {
          const userDetailsResponse = await axios.get('http://localhost:5000/user_info');
          setUserDetails(userDetailsResponse.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleTransferStyle = async () => {
    if (!contentImage || !styleImage) {
      alert('Please select both content and style images.');
      return;
    }

    // Check file type (allow only images)
    const isImage = (file) => {
      return file['type'].split('/')[0] === 'image';
    };

    // Check file size (limit to 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (!isImage(contentImage) || !isImage(styleImage)) {
      alert('Please upload valid image files (JPEG or PNG).');
      return;
    } else if (contentImage.size > MAX_FILE_SIZE || styleImage.size > MAX_FILE_SIZE) {
      alert('Image file size should not exceed 10MB.');
      return;
    }

    setUploading(true);
    setShowUploadAnimation(true);

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
      const response = await axios.post('http://localhost:5000/transfer_style', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        },
      });
      setGeneratedImage(response.data.generated_image);
    } catch (error) {
      console.error('Error transferring style:', error);
      alert('Error transferring style. Please try again.');
    } finally {
      setUploading(false);
      setShowUploadAnimation(false);
    }
  };

  const handleSignout = async () => {
    try {
      await axios.get('http://localhost:5000/signout');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="style-transfer-form">
      <div className="login-icon-container">
        <span id="welcome-msg">Welcome, {userDetails.name}!</span>
        <Link to="/profile">
          <img src={loginIcon} alt="Login" className="login-icon" />
        </Link>
      </div>

      <div className="upload-section">
        <ImageUpload
          label="Content Image"
          setImage={setContentImage}
          brightness={contentBrightness}
          setBrightness={setContentBrightness}
          contrast={contentContrast}
          setContrast={setContentContrast}
          className="dashing"
        />
        {showUploadAnimation && <div className="loaderx"></div>}
        <ImageUpload
          label="Style Image"
          setImage={setStyleImage}
          brightness={styleBrightness}
          setBrightness={setStyleBrightness}
          contrast={styleContrast}
          setContrast={setStyleContrast}
          className="dashing"
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
          <h3 style={{ margin: '20px' }}>GENERATED IMAGE</h3>
          <img src={`http://localhost:5000/generated_image/${generatedImage}`} alt="Generated" className="genz" />
          <a href={`http://localhost:5000/generated_image/${generatedImage}`} download>
            Download Image
          </a>
        </div>
      )}

      <button className="signout-btn" onClick={handleSignout}>
        Sign Out
      </button>
    </div>
  );
};

export default StyleTransferForm;
