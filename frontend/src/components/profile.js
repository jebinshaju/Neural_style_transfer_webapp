import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profilestyles.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    // Fetch user details and images
    axios.get('http://localhost:5000/user_info')
      .then(response => {
        setUserDetails(response.data);
        setLoading(false); // Turn off loading indicator
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        setLoading(false); // Turn off loading indicator in case of error
      });

    axios.get('http://localhost:5000/get_user_images')
      .then(response => {
        setUserImages(response.data);
      })
      .catch(error => {
        console.error('Error fetching user images:', error);
      });
  }, []);

  const handleEditName = () => {
    setEditingName(true);
    setNewName(userDetails.name);
  };

  const handleSaveName = () => {
    axios.post('http://localhost:5000/change_name', { new_name: newName })
      .then(response => {
        if (response.data.success) {
          setUserDetails(prevState => ({ ...prevState, name: newName }));
          setEditingName(false);
        } else {
          console.error('Error updating name:', response.data.error);
          // Handle error (display error message to the user, etc.)
        }
      })
      .catch(error => {
        console.error('Error updating name:', error);
        // Handle error
      });
  };

  return (
    <div className='containerP'>
      <div className="profile-container">
        <div className="user-details">
          <h2 id="userI">User Details</h2>
          <div>
            <label>Name:</label>
            {editingName ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={handleSaveName}>Save</button>
              </>
            ) : (
              <>
                <span>{userDetails.name}</span>
                <button onClick={handleEditName}>Edit</button>
              </>
            )}
          </div>
          <div>
            <label>Email:</label>
            <span>{userDetails.email}</span>
          </div>
        </div>
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
    </div>
  );
};

export default Profile;
