import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profilestyles.css';

const Profile = () => {
  const [userImages, setUserImages] = useState([]);

  useEffect(() => {
    // Fetch user images
    axios.get('http://localhost:5000/get_user_images')
      .then(response => {
        setUserImages(response.data);
      })
      .catch(error => {
        console.error('Error fetching user images:', error);
      });
  }, []);

  return (
    <div className="profile-container">
      <h2>User Images</h2>
      <div className="image-grids">
        {userImages && Object.keys(userImages).map(imageKey => (
          <div key={imageKey} className="image-item">
            <div className='image-set'>
            <img src={userImages[imageKey].content} alt={`Content ${imageKey}`} />
         
            <img src={userImages[imageKey].style} alt={`Style ${imageKey}`} />

            <img src={userImages[imageKey].generated} alt={`Generated ${imageKey}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
