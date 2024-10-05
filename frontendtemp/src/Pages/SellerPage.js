import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { fetchSellerByEmail, updateSellerByEmail } from '../RequestSendingMethods';

const SellerPage = ({ email }) => {
  const [sellerData, setSellerData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [oldEmail, setOldEmail] = useState(email);

  useEffect(() => {
    const getSellerData = async () => {
      const response = await fetchSellerByEmail(email);
      if (response) {
        setSellerData(response.seller); // Set sellerData directly to the seller object
        setEditedData(response.seller); // Initialize editable data with fetched seller data
      }
    };
  
    getSellerData();
  }, [email]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Save a copy of the old email if it was changed
      if (editedData.email !== oldEmail) {
        setOldEmail(editedData.email);
      }

      // Update sellerData with the new editedData so the frontend reflects the changes
      setSellerData(editedData);

      // Perform the update API call to save the changes
      try {
        const response = await updateSellerByEmail(oldEmail, editedData);
        if (response) {
          console.log('Seller updated successfully:', response);
        }
      } catch (error) {
        console.error('Error updating seller:', error);
      }
    }
  };

  return (
    <div className="seller-page">
      {/* Sidebar Toggle Button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h3>Quick Links</h3>
          {/* Add any quick links or buttons here */}
        </div>
      </div>

      {/* Main Container */}
      <div className={`container ${isSidebarOpen ? 'shifted' : ''}`}>
        <header className="header">
          <h1>Welcome, Seller!</h1>
        </header>

        <div className="profile">
          <h2 className="form-header">Your Profile</h2>
          <div className="profile-info">
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedData?.name || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{sellerData?.name || 'NA'}</p>
            )}
          </div>
          <div className="profile-info">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editedData?.email || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{sellerData?.email || 'NA'}</p>
            )}
          </div>
          <div className="profile-info">
            <label>Description:</label>
            {isEditing ? (
              <input
                type="text"
                name="description"
                value={editedData?.description || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{sellerData?.description || 'NA'}</p>
            )}
          </div>

          <button className="btn" onClick={handleUpdateProfile}>
            {isEditing ? 'Save Changes' : 'Update Profile'}
          </button>
        </div>

        <footer className="footer">
          <p>&copy; 2024 TravelApp. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default SellerPage;
