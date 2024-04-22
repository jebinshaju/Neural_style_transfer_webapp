import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './profilestyles.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    // Fetch user details
    axios.get('https://nstapi.politeriver-d3fc4f5c.centralindia.azurecontainerapps.io/user_info')
      .then(response => {
        setUserDetails(response.data);
        setLoading(false); // Turn off loading indicator
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        setLoading(false); // Turn off loading indicator in case of error
      });
  }, []);

  const handleEditName = () => {
    setEditingName(true);
    setNewName(userDetails.name);
  };

  const handleSaveName = () => {
    axios.post('https://nstapi.politeriver-d3fc4f5c.centralindia.azurecontainerapps.io/change_name', { new_name: newName })
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
            <br />
            <br />
            {/* View Gallery Link */}
            <Link to="/gallery">View Gallery</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
