import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { fetchSellerByEmail, updateSellerByEmail } from '../RequestSendingMethods';
import SellerManagementPage from './SellerManagementPage'; // Import the new page
import Search from './Search';
import FilterProductByPrice from './FilterProductByPrice'
import DeleteSeller from '../Components/DeleteSellerAcc';
import UploadDocumentsSeller from './UploadDocumentsSeller'
import UploadingAlogoSeller from './UploadingAlogoSeller'

const TermsAndConditionsModal = ({ onAccept }) => {
  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <h2>Terms and Conditions</h2>
              <p>Please Accept The Terms and Conditions to proceed.</p>
              <button onClick={onAccept}>Accept</button>
          </div>
      </div>
  );
};


const SellerPage = ({ email }) => {
  const [sellerData, setSellerData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [oldEmail, setOldEmail] = useState(email);
  const [isViewingManagement, setIsViewingManagement] = useState(false); // State for conditional rendering
  const [isProductFilterActive,setIsProductFilterActive]=useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploadPage, setUploadPage]=useState(true); // default with true
  const [isUploadingAlogo,setIsUploadingAphoto]=useState(false);
  const handleBackfromUploadPage = () => {
    setUploadPage(false);
  }; 
  useEffect(() => {
    const getSellerData = async () => {
      const response = await fetchSellerByEmail(email);
      if (response) {
        setSellerData(response.seller);
        setEditedData(response.seller);
      }
    };

    getSellerData();
  }, [email]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleAcceptTerms = () => {
    setTermsAccepted(true); // Set terms as accepted
};
if (!termsAccepted) {
    return <TermsAndConditionsModal onAccept={handleAcceptTerms} />;
}
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };
  const handleProductFilterButtonOnClick =()=>{
    setIsProductFilterActive(true);
  }
  const handleUploadPhoto =()=>{
    setIsUploadingAphoto(true);
  }
  const handleBackToSeller =()=>{
    setIsUploadingAphoto(false);
  }
  if(isProductFilterActive){
    return <FilterProductByPrice/>
  }

  const handleUpdateProfile = async () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      if (editedData.email !== oldEmail) {
        setOldEmail(editedData.email);
      }
      setSellerData(editedData);
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
  if (uploadPage){
    return <UploadDocumentsSeller onBack={handleBackfromUploadPage} email={email} />
  }
  if(isUploadingAlogo){
    return <UploadingAlogoSeller onBack={handleBackToSeller} email={email} />;
  }
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
          <button onClick={() => setIsViewingManagement(true)}>SellerProduct</button> {/* New button */}
          <button onClick={handleProductFilterButtonOnClick}>
            Filter Product by Price
          </button> {/* New button with commented action listener */}
          <button onClick={handleUploadPhoto}>Upload_A_Logo</button>
        </div>
      </div>

      {/* Conditional Rendering */}
      <div className={`container ${isSidebarOpen ? 'shifted' : ''}`}>
        {isViewingManagement ? (
          <SellerManagementPage  /> // {/* Pass seller's ID to SellerManagementPage id={sellerData?.id} */}
        ) : (
          <>
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
                <label>Password:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="password"
                    value={editedData?.password || ''}
                    onChange={handleEditChange}
                  />
                ) : (
                  <p>{"Not Visible" || 'NA'}</p>
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
             < DeleteSeller email={sellerData?.email} />
            <footer className="footer">
              <p>&copy; 2024 TravelApp. All rights reserved.</p>
            </footer>
          </>
        )}
      </div>
      <Search/>
    </div>
  );
};

export default SellerPage;
