import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { fetchTourGuideByEmail , updateTourGuideByEmail} from '../RequestSendingMethods';
import ItineraryList from '../Components/ItineraryList';
import CreateItineraryForm from '../Components/CreateItineraryForm';
import UploadDocumentsTourGuide from './UploadDocumentsTourGuide'
import UploadingPhotoTourGuide from './UploadingApictureTourGuide'
import DeleteTA from '../Components/DeleteTourGuideAndAdver';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import updateAcceptedTermsAndConditions from '../Services/tourGuideServices'
import TourGuideSalesReport from './TourGuideSalesReport'
import TourGuideItinerariesUsersReport from './TourGuideNumberofSubscribersReport'
import Notification from './TourGuideNotifications'
import styles from '../styles/TourGuidePage.module.css'; // Keep your existing global styles


let flag= true ;
const TermsAndConditionsModal = ({ onAccept }) => {
  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <h2>Terms and Conditions</h2>
              <p>Your terms and conditions content goes here.</p>
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

const TourGuideHomePage = ({ email }) => {
  const location = useLocation();

  const login = location.state?.login || false;
  if(login){
    const userData = JSON.parse(localStorage.getItem('userData'));
    email = userData?.email;
  }
  const [showItineraryDisplay, setShowItineraryDisplay] = useState(false);
  const [tourGuideData, setTourGuideData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [oldEmail, setOldEmail] = useState(email);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploadPage, setUploadPage]=useState(true); // default with true 
  const [isCreating, setIsCreating] = useState(false); // State to manage the visibility of the form
  const [id, setId] = useState(null);
  // what i added here is that after the registration is done we would render this page but initially the upload then after pressing back
  // we get here normally to the tour guide home page
  const [showSalesReport,setShowSalesReport]=useState(false);
  const [isUploadingApicture, setisUploadingApicture] = useState(false);
  const [ShowUsersReport,setShowUsersReport]=useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const handleBackfromUploadPage = () => {
    setUploadPage(false);
  };

  const handleCreateButtonClick = () => {
    setIsCreating(true); // Show the form when the button is clicked
  };

  const closeForm = () => {
    setIsCreating(false); // Hide the form
  };

  useEffect(() => {
    const getTourGuideData = async () => {
      try {
        //console.log("Fetching tour guide with email:", email); // Log the email for debugging
        // Fetch tour guide data by email from the backend
        const response = await fetchTourGuideByEmail(email); // Pass email directly
        setTourGuideData(response);
        //console.log("tourGuide : ", response)
        setId(response._id)
        setEditedData(response); // Initialize editable data with fetched data
        //setTermsAccepted(response.acceptedTermsAndConditions);
      } catch (error) {
        console.error("Error fetching tour guide data:", error);
      }
    };

    getTourGuideData();

    const interval = setInterval(() => {
      getTourGuideData();
    }, 5000); // 5000ms = 5 seconds
  
    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, [email]);

  const { _id: tourGuideId } = tourGuideData || {};

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleViewItineraryDisplay = () => {
    setShowItineraryDisplay((prevState) => !prevState); // Set state to true to show the ItineraryDisplay
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true); // Set terms as accepted
    console.log("id = ", id)
    updateAcceptedTermsAndConditions(tourGuideData._id);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    if(!isEditing){
      const userInput = prompt("Please enter your password:");
      if( userInput !== tourGuideData.password){
        return
      }
      
    }
    if (isEditing) {
      try {
        console.log('Email:', email);
        console.log('Updated Data:', { updatedData: editedData }); // Log updated data
        const response = await updateTourGuideByEmail(email, { updatedData: editedData });
        console.log("RESPONSE" , response)
        if (response) {
          setTourGuideData(editedData); // Update state with edited data
          console.log("response", response)
        }
        const userInput2 = prompt("Please confirm password:");
        if( userInput2 !== tourGuideData.password && isEditing){
          return
        }
      } catch (error) {
        console.error('Error updating advertiser:', error);
      }
    }
    setIsEditing(!isEditing); // Toggle editing state
  };
  const handleDeleteReq = async () => {
    try {
        // Set the 'delete' field to true for the seller
        let editedData = { delete: true };

        // Assuming 'sellerData' contains the email or ID of the seller you want to update
        const response = await updateTourGuideByEmail(tourGuideData.email,  { updatedData: editedData });  // or sellerData._id if you're using ID instead of email
        alert("Tour Guide has been marked for deletion.");
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

  

  if (uploadPage && !tourGuideData?.IdDocument && !tourGuideData?.certificatesDocument && !login){
    return <UploadDocumentsTourGuide onBack={handleBackfromUploadPage} email={email} />
  }

  const handleBackfromUploadPicPage = () => {
    setisUploadingApicture(false);
  };

  if(isUploadingApicture){
  return <UploadingPhotoTourGuide onBack={handleBackfromUploadPicPage} email={email} />
  }
  const handleUploadAphoto = () => {
    // this function should take me to a new page called TourGuideUploadPhoto, this page would have a structure quite similar
    // to the uploadDocumentsTourGuide , and we will be using the same backend with minor adjustments
    setisUploadingApicture(true);
  };
  const handleViewSalesReport =()=>{
    setShowSalesReport(true);
  }
  const handleBackfromSalesPage =()=>{
    setShowSalesReport(false);
  }
  const handleviewItineraryUsersReport =()=>{
    setShowUsersReport(true);
  }
  const handlebackFromUsersReport =()=>{
    setShowUsersReport(false);
  }
  const toggleNotification = () => {
    setShowNotification((prevState) => !prevState);
  };
  if(ShowUsersReport){
    return <TourGuideItinerariesUsersReport id={id} onBack={handlebackFromUsersReport}/>
  }
  if(showSalesReport){
    return <TourGuideSalesReport onBack ={handleBackfromSalesPage} id ={id}/>
  }


  if (uploadPage && !login) {
    return (
      <UploadDocumentsTourGuide
        onBack={handleBackfromUploadPage}
        email={email}
      />
    );
  }
  if (isUploadingApicture) {
    return (
      <UploadingPhotoTourGuide
        onBack={handleBackfromUploadPicPage}
        email={email}
      />
    );
  }
  const r1 =()=>{
    console.log("00000000000")
    navigate("/");
    
  }

  

  if (!termsAccepted && !login) {
    return <TermsAndConditionsModal onAccept={handleAcceptTerms} />;
  }

  if(tourGuideData?.isPendingAcceptance || tourGuideData?.isAccepted==="false" ){
    return <NotAccepted onAccept={()=>r1()} />
  }

  return (
    <div className="tour-guide-page">
     
    

      {/* Sidebar */}
      <div className={styles.navbar}>
  <button onClick={handleUploadAphoto} className={styles.button2}>Upload A Photo</button>
  <button onClick={handleViewSalesReport}className={styles.button2}>View Sales Report</button>
  <button onClick={handleviewItineraryUsersReport}className={styles.button2}>View Users Report</button>
   

</div>



      {/* Main Container */}
      <div className={styles.tourGiudePage}>
      <div className={`container ${isSidebarOpen ? "shifted" : ""}`}>
        <header className={styles.header}>
          <h1 className={styles.h1}>Welcome, Tour Guide!</h1>
        </header>
         {/* Notification Container */}
         <div className="notification-container">
      <button 
        onClick={toggleNotification} 
        className={styles.button6}
        
      >
        {showNotification ? 'Hide Notification' : 'Show Notification'}
       
      </button>
      
      {showNotification && tourGuideData && (
        <Notification 
          targetId={tourGuideData._id} 
          targetType="TourGuide" 
        />
      )}
    </div>
    <div className={styles['category-buttons3']}>
          <h2  className={styles.h2}>Your Profile</h2>
          <div className={styles.categoryButtons}>
          <div className="categoryButton">
          <label >Logo:</label>
              <div className="seller-logo-container">
                {tourGuideData && tourGuideData.photo ? (
                  <img
                    src={tourGuideData.photo}
                    alt="tour guide Logo"
                    style={{ marginLeft : '45%', width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                ) : (
                  <p>Loading logo...</p> // Fallback during data fetch or when logo is unavailable
                )}
              </div>
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedData?.name || ""}
                onChange={handleEditChange}
              />
            ) : (
              <p>{tourGuideData?.name || "NA"}</p>
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
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editedData?.email || ""}
                onChange={handleEditChange}
              />
            ) : (
              <p>{tourGuideData?.email || "NA"}</p>
            )}
          </div>
          <div className="profile-info">
            <label >Mobile:</label>
            {isEditing ? (
              <input
                type="text"
                name="mobile"
                value={editedData?.mobile || ""}
                onChange={handleEditChange}
              />
            ) : (
              <p>{tourGuideData?.mobile || "NA"}</p>
            )}
          </div>
          <div className="profile-info">
            <label >Nationality:</label>
            {isEditing ? (
              <input
                type="text"
                name="nationality"
                value={editedData?.nationality || ""}
                onChange={handleEditChange}
              />
            ) : (
              <p>{tourGuideData?.nationality || "NA"}</p>
            )}
          </div>
          <div className="profile-info">
            <label >Previous Work:</label>
            {isEditing ? (
              <input
                type="text"
                name="previousWork"
                value={editedData?.previousWork || ""}
                onChange={handleEditChange}
              />
            ) : (
              <p>{tourGuideData?.previousWork || "NA"}</p>
            )}
          </div>
          <div className="profile-info">
            <label >Years of Experience:</label>
            {isEditing ? (
              <input
                type="number"
                name="yearsOfExperience"
                value={editedData?.yearsOfExperience || ""}
                onChange={handleEditChange}
              />
            ) : (
              <p>{tourGuideData?.yearsOfExperience || "NA"}</p>
            )}
          </div>
          {isEditing ? (
    <button onClick={() => handleDeleteReq()} className={styles.button}>
      Send delete Request
    </button>
  ) : null}
          <button onClick={handleUpdateProfile} className={styles.button}>
            {isEditing ? "Save Changes" : "Update Profile"}
          </button>
          </div>
        
        </div>

        <div className={styles['category-buttons']}>
          <h2 className={styles.h2}>Your Itinerary</h2>
          <button className={styles.button} onClick={handleViewItineraryDisplay}>
            {showItineraryDisplay
              ? "Hide Full Itinerary"
              : "View Full Itinerary"}
          </button>
          <button className={styles.button} onClick={handleCreateButtonClick}>
            Create Itinerary
          </button>
        </div>

        {isCreating && (
          <CreateItineraryForm onClose={closeForm} tourGuideId={tourGuideId} />
        )}

        {showItineraryDisplay && <ItineraryList tourGuideId={tourGuideId} />}
         
        <button className={styles.button}  onClick={() => navigate("/")}>
           Back to login Page
          </button>
        
        <footer className={styles.footer1}>
          <p>&copy; 2024 TravelApp. All rights reserved.</p>
        </footer>
      </div>
    </div>
    </div>
  );
};

export default TourGuideHomePage;
