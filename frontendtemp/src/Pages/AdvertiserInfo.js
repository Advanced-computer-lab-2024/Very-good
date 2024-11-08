import React, { useState, useEffect } from 'react';
import { fetchAdvertiserByEmail, updateAdvertiserByEmail } from '../RequestSendingMethods';
import UploadingALogoAdvertiser from './UploadingALogoAdvertiser'
import '../styles/global.css'; // Assuming global styles are shared across components
import DeleteTA from '../Components/DeleteTourGuideAndAdver';
const AdvertiserInfo = ({ email, onBack }) => {
  const [advertiserData, setAdvertiserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar
  const [ISuploadLogoAdvertiserOpen,setISuploadLogoAdvertiserOpen]=useState(false);  let flag= false ;
  useEffect(() => {
    const getAdvertiserData = async () => {
      try {
        const response = await fetchAdvertiserByEmail({ email });
        if (response) {
          setAdvertiserData(response.advertiser);
          setEditedData(response.advertiser);
        }
      } catch (error) {
        console.error('Error fetching advertiser data:', error);
      }
    };

    if (email) {
      getAdvertiserData();
    }
  }, [email]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    if (isEditing) {
      try {
        const response = await updateAdvertiserByEmail(email, { updatedData: editedData });
        console.log("RESPONSE" , response)
      if (response) {
          setAdvertiserData(editedData);
          console.log("response", response)
      }
      } catch (error) {
        console.error('Error updating advertiser:', error);
      }
    }
    setIsEditing(!isEditing);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleUploadLogo = ()=>{
   setISuploadLogoAdvertiserOpen(true);
  };
  const handleBackToAdvertiserInfo =()=>{
    setISuploadLogoAdvertiserOpen(false);
  }
  if(ISuploadLogoAdvertiserOpen){
    return <UploadingALogoAdvertiser onBack={handleBackToAdvertiserInfo} email={email} />;
  }
  return (
    <div className={`advertiser-page ${isSidebarOpen ? 'shifted' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <button onClick={handleUploadLogo}>Upload Logo</button>
        </div>
      </div>

      <div className="container">
        <header className="header">
          <h1>Welcome, Advertiser!</h1>
        </header>

        <div className="profile">
          <h2 className="form-header">Advertiser Profile</h2>

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
              <p>{advertiserData?.name || 'NA'}</p>
            )}
          </div>
          <div className="profile-info">
            <label>Password:</label>
            {isEditing ? (
              <input
                type="text"
                name="password"
                value={editedData?.password || ''}
                onChange={handleEditChange}
              />
            ) : (
              <p>{"Not Visible"|| 'NA'}</p>
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
              <p>{advertiserData?.email || 'NA'}</p>
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
              <p>{advertiserData?.description || 'NA'}</p>
            )}
          </div>

          <button className="btn" onClick={handleUpdateProfile}>
            {isEditing ? 'Save Changes' : 'Update Profile'}
          </button>

          <button className="back-button bottom-right" onClick={onBack}>
            &larr; Back
          </button>
        </div>
        
        <DeleteTA dataTA={advertiserData?.email} isTourGuideA={flag}/>

        <footer className="footer">
          <p>&copy; 2024 TravelApp. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdvertiserInfo;
