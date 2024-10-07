import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { fetchTouristByEmail, updateTouristByEmail } from '../RequestSendingMethods';
import ActivityHistoricalList from '../Components/UpcomingSort.js';
import ProductSort from '../Components/SortProductRate.js';
import FilterActivitiesPage from './FilterActivitiesPage'; // Import the new component
import FilterItenaryPage from './FilterItenaryPage';
import ActivityItinerarySort from '../Components/SortRatePrice.js';
import MuseumSearch from './MuseumSearch';
import FilterHistoricalPage from './FilterHistoricalPage';
import FilterProductByPrice from './FilterProductByPrice';

const TouristPage = ({ email }) => {
  const [touristData, setTouristData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [oldEmail, setOldEmail] = useState(email);
  const [showFilterPage, setShowFilterPage] = useState(false); // New state to manage page rendering
  const [ShowItenaryPage, setShowFilterItenaryPage] = useState(false);
  const [showHistoricalPlace, setShowFilterHistoricalPage] = useState(false);
  const [showProductFilterPage, setShowProductFilterPage] = useState(false);

  useEffect(() => {
    const getTouristData = async () => {
      const response = await fetchTouristByEmail({ email });
      if (response) {
        setTouristData(response.data);
        setEditedData(response.data); // Initialize editable data with fetched data
      }
    };

    getTouristData();
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
      
      // Update touristData with the new editedData so the frontend reflects the changes
      setTouristData(editedData);

      // Perform your function call to save the changes here, excluding wallet
      console.log('Changes saved:', editedData, oldEmail);
      updateTouristByEmail(oldEmail, editedData);
    }
  };

  // Function to handle rendering the filter activities page
  const handleFilterActivitiesClick = () => {
    setShowFilterPage(true);
  };

  // Function to handle back button click
  const handleBackToTouristPage = () => {
    setShowFilterPage(false);
  };

  // Render the appropriate content based on the state
  if (showFilterPage) {
    return <FilterActivitiesPage onBack={handleBackToTouristPage} />;
  }

  const handleFilterItenariesClick = () => {
    setShowFilterItenaryPage(true);
  }

  const handleBackToTouristPageFromItenaryFilterPage = () => {
    setShowFilterItenaryPage(false);
  }
  
  if (ShowItenaryPage) {
    return <FilterItenaryPage onBack={handleBackToTouristPageFromItenaryFilterPage} />;
  }

  const handleFilterHistoricalPlacesClick = () => {
    setShowFilterHistoricalPage(true);
  }

  const handleBackToTouristPageFromFilterHistoricalPlacesPage = () => {
    setShowFilterHistoricalPage(false);
  }
  
  if (showHistoricalPlace) {
    return <FilterHistoricalPage onBack={handleBackToTouristPageFromFilterHistoricalPlacesPage} />;
  }

  const handleFilterProductPageClick = () => {
    setShowProductFilterPage(true);
  }
  
  const handleBackToTouristPageFromFilterProductPage = () => {
    setShowProductFilterPage(false);
  }

  if (showProductFilterPage) {
    return <FilterProductByPrice onBack={handleBackToTouristPageFromFilterProductPage} />;
  }

  return (
    <div className="tourist-page">
      {/* Sidebar Toggle Button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h3>Quick Links</h3>
          <button onClick={handleFilterActivitiesClick}>Filter Activities</button>
          <button onClick={handleFilterItenariesClick}>Filter Itineraries</button>
          <button onClick={handleFilterHistoricalPlacesClick}>Filter Historical Places</button>
          <button onClick={handleFilterProductPageClick}>Filter Products</button>
        </div>
      </div>

      {/* Main Container */}
      <div className={`container ${isSidebarOpen ? 'shifted' : ''}`}>
        <header className="header">
          <h1>Welcome, Tourist!</h1>
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
              <p>{touristData?.name || 'NA'}</p>
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
              <p>{touristData?.email || 'NA'}</p>
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
              <p>{touristData?.mobile || 'NA'}</p>
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
              <p>{touristData?.nationality || 'NA'}</p>
            )}
          </div>
          <div className="profile-info">
            <label>Job:</label>
            {isEditing ? (
              <input
                type="text"
                name="job"
                value={editedData?.job || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{touristData?.job || 'NA'}</p>
            )}
          </div>
          <div className="profile-info">
            <label>Date of Birth:</label>
            <p>{touristData?.dob || 'NA'}</p> {/* Assuming you meant 'dob' here */}
          </div>
          <div className="profile-info">
            <label>Wallet Balance:</label>
            <p>${touristData?.wallet || 'NA'}</p> {/* Display wallet balance but do not allow editing */}
          </div>

          <button className="btn" onClick={handleUpdateProfile}>
            {isEditing ? 'Save Changes' : 'Update Profile'}
          </button>
        </div>
        <ActivityHistoricalList /> 
        <ActivityItinerarySort />
        <ProductSort />
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
      <MuseumSearch />
    </div>
  );
};

export default TouristPage;
