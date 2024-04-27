import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './profilestyles.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [accountDeleted, setAccountDeleted] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    // Fetch user details
    axios.get('http://localhost:5000/user_info')
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

  const handleDeleteAccount = () => {
    axios.delete('http://localhost:5000/delete_user')
      .then(response => {
        if (response.data.success) {
          setAccountDeleted(true);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          console.error('Error deleting account:', response.data.error);

        }
      })
      .catch(error => {
        console.error('Error deleting account:', error);
      });
  };

  return (
    <div className='containerP'>
      <div className="profile-container">
        <div className="user-details">
          <h2 id="userI">User Details</h2>
          {accountDeleted ? (
            <p style={{ color: 'green' }}>Account deleted</p>
          ) : (
            <>
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
              <div>
                {/* Delete Account Button */}
                <button onClick={handleDeleteAccount}>Delete Account</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
