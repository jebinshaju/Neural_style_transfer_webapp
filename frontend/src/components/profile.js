import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profilestyles.css';

const Profile = () => {
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user images
    axios.get('http://localhost:5000/get_user_images')
      .then(response => {
        setUserImages(response.data);
        setLoading(false); // Turn off loading indicator
      })
      .catch(error => {
        console.error('Error fetching user images:', error);
        setLoading(false); // Turn off loading indicator in case of error
      });
  }, []);

  return (
    <div className="profile-container">
      <h2 id="userI">User Images</h2>
      {loading && <div className="loadery"></div>}
      <div className="image-grids">
        {userImages && Object.keys(userImages).map(imageKey => (
          <div key={imageKey} className="image-item">
            <div className='image-set'>
              <img src={userImages[imageKey].content} alt={`Content ${imageKey}`} />
              <div className="operation">
                <div className="symbol">+</div>
              </div>
              <img src={userImages[imageKey].style} alt={`Style ${imageKey}`} />
              <div className="operation">
                <div className="symbol">=</div>
              </div>
              <img src={userImages[imageKey].generated} alt={`Generated ${imageKey}`} />

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
