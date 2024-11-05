import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { fetchTourGuideByEmail } from '../RequestSendingMethods';
import ItineraryList from '../Components/ItineraryList';
import CreateItineraryForm from '../Components/CreateItineraryForm';
import UploadDocumentsTourGuide from './UploadDocumentsTourGuide'
import UploadingPhotoTourGuide from './UploadingApictureTourGuide'
const id = "66fc1fbc46fa6d1f6fb6295a"

const TourGuideHomePage = ({ email }) => {
  const [showItineraryDisplay, setShowItineraryDisplay] = useState(false);
  const [tourGuideData, setTourGuideData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [oldEmail, setOldEmail] = useState(email);
  const [uploadPage, setUploadPage]=useState(true); // default with true 
  const [isCreating, setIsCreating] = useState(false); // State to manage the visibility of the form
// what i added here is that after the registration is done we would render this page but initially the upload then after pressing back 
// we get here normally to the tour guide home page 
const [isUploadingApicture,setisUploadingApicture]=useState(false);

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

  const handleViewItineraryDisplay = () => {
    setShowItineraryDisplay(prevState => !prevState); // Set state to true to show the ItineraryDisplay
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

  const handleUploadAphoto = () => {
   // this function should take me to a new page called TourGuideUploadPhoto, this page would have a structure quite similar 
   // to the uploadDocumentsTourGuide , and we will be using the same backend with minor adjustments 
   setisUploadingApicture(true);
  };
  const handleBackfromUploadPicPage =() =>{
    setisUploadingApicture(false);
  }


  if (uploadPage){
    return <UploadDocumentsTourGuide onBack={handleBackfromUploadPage} email={email} />
  }
  if(isUploadingApicture){
  return <UploadingPhotoTourGuide onBack={handleBackfromUploadPicPage} email={email} />
  }
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
          <button onClick={handleUploadAphoto}>Upload A photo</button>
        {/*  <button onClick={() => alert('Filter Itineraries')}>Filter Itineraries</button>
             <button onClick={() => alert('Filter Historical Places')}>Filter Historical Places</button>
             <button onClick={() => alert('Filter Products')}>Filter Products</button>*/}
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
          <button className="btn" onClick={handleViewItineraryDisplay}>
            {showItineraryDisplay ? 'Hide Full Itinerary' : 'View Full Itinerary'}
          </button>
          <button className="btn" onClick={handleCreateButtonClick}>
            Create Itinerary
          </button>
        </div>

        {isCreating && <CreateItineraryForm onClose={closeForm} tourGuideId={id}/>}

        {showItineraryDisplay && <ItineraryList tourGuideId={id} />}

        <footer className="footer">
          <p>&copy; 2024 TravelApp. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default TourGuideHomePage;
