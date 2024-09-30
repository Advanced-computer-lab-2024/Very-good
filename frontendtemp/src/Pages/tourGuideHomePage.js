import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { fetchTourGuideByEmail } from '../RequestSendingMethods';

const TourGuideHomePage = ({ email }) => {
  const [tourGuideData, setTourGuideData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [oldEmail, setOldEmail] = useState(email);

  useEffect(() => {
    const getTourGuideData = async () => {
      try {
        console.log('Fetching tour guide with email:', email); // Log the email for debugging
        // Fetch tour guide data by email from the backend
        const response = await fetchTourGuideByEmail(email); // Pass email directly
        setTourGuideData(response);
        setEditedData(response); // Initialize editable data with fetched data
      } catch (error) {
        console.error('Error fetching tour guide data:', error);
      }
    };

    getTourGuideData();
  }, [email]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleUpdateProfile = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Save a copy of the old email if it was changed
      if (editedData.email !== oldEmail) {
        setOldEmail(editedData.email);
      }

      // Update tourGuideData with the new editedData so the frontend reflects the changes
      setTourGuideData(editedData);

      // Placeholder for updating the tour guide profile
      // updateTourGuideByEmail(oldEmail, editedData);
      console.log('Changes saved:', editedData, oldEmail);
    }
  };

  return (
    <div className="tour-guide-page">
      {/* Sidebar Toggle Button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h3>Quick Links</h3>
          <button onClick={() => alert('Filter Activities')}>Filter Activities</button>
          <button onClick={() => alert('Filter Itineraries')}>Filter Itineraries</button>
          <button onClick={() => alert('Filter Historical Places')}>Filter Historical Places</button>
          <button onClick={() => alert('Filter Products')}>Filter Products</button>
        </div>
      </div>

      {/* Main Container */}
      <div className={`container ${isSidebarOpen ? 'shifted' : ''}`}>
        <header className="header">
          <h1>Welcome, Tour Guide!</h1>
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
              <p>{tourGuideData?.name || 'NA'}</p>
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
              <p>{tourGuideData?.email || 'NA'}</p>
            )}
          </div>
          <div className="profile-info">
            <label>Mobile:</label>
            {isEditing ? (
              <input
                type="text"
                name="mobile"
                value={editedData?.mobile || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{tourGuideData?.mobile || 'NA'}</p>
            )}
          </div>
          <div className="profile-info">
            <label>Nationality:</label>
            {isEditing ? (
              <input
                type="text"
                name="nationality"
                value={editedData?.nationality || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{tourGuideData?.nationality || 'NA'}</p>
            )}
          </div>
          <div className="profile-info">
            <label>Previous Work:</label>
            {isEditing ? (
              <input
                type="text"
                name="previousWork"
                value={editedData?.previousWork || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{tourGuideData?.previousWork || 'NA'}</p>
            )}
          </div>
          <div className="profile-info">
            <label>Years of Experience:</label>
            {isEditing ? (
              <input
                type="number"
                name="yearsOfExperience"
                value={editedData?.yearsOfExperience || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{tourGuideData?.yearsOfExperience || 'NA'}</p>
            )}
          </div>

          <button className="btn" onClick={handleUpdateProfile}>
            {isEditing ? 'Save Changes' : 'Update Profile'}
          </button>
        </div>

        <div className="itinerary-layout">
          <h2 className="itinerary-header">Your Itinerary</h2>
          <button className="btn" onClick={() => alert('View Full Itinerary')}>
            View Full Itinerary
          </button>
        </div>

        <footer className="footer">
          <p>&copy; 2024 TravelApp. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default TourGuideHomePage;
