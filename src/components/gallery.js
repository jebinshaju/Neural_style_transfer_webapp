import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserImages = () => {
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user images
    axios.get('https://nstapi.politeriver-d3fc4f5c.centralindia.azurecontainerapps.io/get_user_images')
      .then(response => {
        setUserImages(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user images:', error);
        setLoading(false);
      });
  }, []);

  const handleImageClick = (imageKey) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = userImages[imageKey].generated; // Set the href attribute to the generated image URL
    link.download = `Generated_Image_${imageKey}.jpg`; // Set the download attribute with a filename
    link.click(); // Simulate a click on the link to trigger the download
  };

  return (
    <div>
      <h2 id="userI">User Images</h2>
      {loading && <div className="loader"></div>}
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
              {/* Add onClick event handler to trigger the download */}
              <img
                src={userImages[imageKey].generated}
                alt={`Generated ${imageKey}`}
                onClick={() => handleImageClick(imageKey)}
                style={{ cursor: 'pointer' }} // Set cursor to pointer to indicate clickable
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserImages;
