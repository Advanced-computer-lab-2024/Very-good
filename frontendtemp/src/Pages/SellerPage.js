import React, { useState, useEffect } from 'react';
import styles from '../styles/SellerPage.module.css'; // Keep your existing global styles
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { fetchSellerByEmail, updateSellerByEmail } from '../RequestSendingMethods';
import SellerManagementPage from './SellerManagementPage'; // Import the new page
import Search from './Search';
import FilterProductByPrice from './FilterProductByPrice'
import DeleteSeller from '../Components/DeleteSellerAcc';
import UploadDocumentsSeller from './UploadDocumentsSeller'
import UploadingAlogoSeller from './UploadingAlogoSeller'
import FetchProducts from '../Components/uploadingAproductPicture'
import updateAcceptedTermsAndConditions from '../Services/sellerServices'
import SellerSalesReport from "./SellerSalesReport"
import Notification from './TourGuideNotifications';
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
const NotAccepted = ({ onAccept }) => {
  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <p>Not Accepted.</p>
              <button onClick={onAccept}>back</button>
          </div>
      </div>
  );
};



const SellerPage = ({ email }) => {

  const location = useLocation();

    const login = location.state?.login || false;
    if(login){
        const userData = JSON.parse(localStorage.getItem('userData'));
        email = userData?.email;
    }

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
  const [isUploadingAproductPicture,setIsUploadingAproductPicture]=useState(false);
  const [ViewSalesReport,setViewSalesReport]=useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const handleBackfromUploadPage = () => {
    setUploadPage(false);
  }; 
  useEffect(() => {
    const fetchSellerData = async () => {
      const response = await fetchSellerByEmail(email);
      if (response) {
        setSellerData(response.seller);
        setEditedData(response.seller);
      }
      console.log("seller : ", response.seller);
    };
  
    // Fetch data initially
    fetchSellerData();
  
    // Set up the interval
    const interval = setInterval(() => {
      fetchSellerData();
    }, 5000); // 5000ms = 5 seconds
  
    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, [email]); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleAcceptTerms = () => {
    setTermsAccepted(true); // Set terms as accepted
    updateAcceptedTermsAndConditions(sellerData._id);
};

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
  const handleDeleteReq = async () => {
    try {
        // Set the 'delete' field to true for the seller
        let editedData = { delete: true };

        // Assuming 'sellerData' contains the email or ID of the seller you want to update
        const response = await updateSellerByEmail(sellerData.email, editedData);  // or sellerData._id if you're using ID instead of email
        alert("Seller has been marked for deletion.");
        // Check if the update was successful
        if (response.success) {
            console.log("Seller marked for deletion:", response);
            // Handle success (e.g., update UI or alert user)
        } else {
            console.error("Failed to mark seller for deletion:", response.message);
            // Handle failure (e.g., show error message)
        }
    } catch (error) {
        console.error("Error updating seller:", error);
        // Handle error (e.g., show error message)
    }
};
  const handleUploadAproductPicture = ()=>{
    setIsUploadingAproductPicture(true);
  }
  const handleSalesReport =()=>{
    setViewSalesReport(true);
  }
  const handleBackFromSellerReportPage =()=>{
    setViewSalesReport(false);
  }
  const handleUpdateProfile = async () => {
    if(!isEditing){
    const userInput = prompt("Please enter your password:");
    if( userInput !== sellerData.password){
      return
    }
  }

    setIsEditing(!isEditing);
    if (isEditing) {
      if (editedData.email !== oldEmail) {
        setOldEmail(editedData.email);
      }
      
      try {
        const response = await updateSellerByEmail(oldEmail, editedData);
        if (response) {
          console.log('Seller updated successfully:', response);
        }
        setSellerData(editedData);
      const userInput2 = prompt("Please confirm password:");
      if( userInput2 !== sellerData.password && isEditing){
        return
      }
      } catch (error) {
        console.error('Error updating seller:', error);
      }
    }
  };
  if (uploadPage && !login){
    return <UploadDocumentsSeller onBack={handleBackfromUploadPage} email={email} />
  }
  if(isUploadingAproductPicture){
    console.log("email passed to the uploadproductpic:",email)
    return <FetchProducts sellerEmail={email}/>
  }
 
  const r1 =()=>{
    console.log("00000000000")
    navigate("/");
    
  }

  if (!termsAccepted && !login) {
    return <TermsAndConditionsModal onAccept={handleAcceptTerms} />;
  }

  if(sellerData?.isPendingAcceptance || sellerData?.isAccepted==="false"){
    return <NotAccepted onAccept={()=>r1()} />
}


  if(isUploadingAlogo){
    return <UploadingAlogoSeller onBack={handleBackToSeller} email={email} />;
  }
  if(ViewSalesReport){
    return <SellerSalesReport  sellerId={sellerData._id}/>
  }
  const toggleNotification = () => {
    setShowNotification((prevState) => !prevState);
  };
  return (
    <div className={styles.sellerPage}>


      {/* Sidebar */}
    
        <div className={styles.navbar}>
       
          <button onClick={() => setIsViewingManagement(true)} className={styles.button2}>SellerProduct</button> {/* New button */}
          <button onClick={handleProductFilterButtonOnClick} className={styles.button2}>
            Filter Product by Price
          </button> {/* New button with commented action listener */}
          <button onClick={handleUploadPhoto} className={styles.button2}>Upload A Logo</button>
          <button onClick={handleUploadAproductPicture} className={styles.button2}>Upload Product Picture</button>
          <button onClick={handleSalesReport} className={styles.button2}>View Products Sales Report</button>
        
        </div>
      
    

      {/* Conditional Rendering */}
      <div className={`container ${isSidebarOpen ? 'shifted' : ''}`}>
        {isViewingManagement ? (
          <SellerManagementPage sellerId={sellerData._id} /> // {/* Pass seller's ID to SellerManagementPage id={sellerData?.id} */}
        ) : (
          <>
            <header className={styles.header}>
              <h1 className={styles.h1t}>Welcome, Seller!</h1>
            </header>

   {/* Notification Container */}
   <div className="notification-container">
      <button 
        onClick={toggleNotification} 
        className={styles.button6}
        
      >
        {showNotification ? 'Hide Notification' : 'Show Notification'}
       
      </button> 
      
      {showNotification && sellerData && (
        <Notification 
          targetId={sellerData._id} 
          targetType="Seller" 
        />
      )}
    </div>



            <div className={styles['category-buttons3']}>
              <h2 className={styles.h2}>Your Profile</h2>
              <div className="profile-info">
              <label >Logo:</label>
              <div className="seller-logo-container">
                {sellerData && sellerData.logo ? (
                  <img
                    src={sellerData.logo}
                    alt="Seller Logo"
                    style={{ marginLeft : '45%', width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                ) : (
                  <p>Loading logo...</p> // Fallback during data fetch or when logo is unavailable
                )}
              </div>
                <label >Name:</label>
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
                <label >Password:</label>
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
                <label >Email:</label>
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

              <button className={styles.button} onClick={handleUpdateProfile}>
                {isEditing ? 'Save Changes' : 'Update Profile'}
              </button>
              <div>
  {isEditing ? (
    <button onClick={() => handleDeleteReq()} className={styles.button3}>
      Send delete Request
    </button>
  ) : null}
</div>

            </div>
              
          <div className={styles['category-buttons']}>
          <Search sellerId={sellerData?._id}/>
          </div>
          <button className={styles.button}  onClick={() => navigate("/")}>
           Back to login Page
          </button>
            <footer className={styles.footer}>
              <p>&copy; 2024 TravelApp. All rights reserved.</p>
            </footer>
          </>
        )}
      </div>
     
    </div>
  );
};

export default SellerPage;
