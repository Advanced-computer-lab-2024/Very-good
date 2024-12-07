import React, { useState, useEffect } from 'react';
import styles from '../styles/TouristPage.module.css'; // Import CSS Module
import { fetchTouristByEmail, updateTouristByEmail ,bookItem} from '../RequestSendingMethods';
import ActivityHistoricalList from '../Components/UpcomingSort.js';
import ProductSort from './SortProductRate.js';
import FilterActivitiesPage from './FilterActivitiesPage';
import FilterItenaryPage from './FilterItenaryPage';
import ActivityItinerarySort from '../Components/SortRatePrice.js';
import MuseumSearch from './MuseumSearch';
import TouristOrders from './ViewTouristOrders.js'
import FilterHistoricalPage from './FilterHistoricalPage';
import FilterProductByPrice from './FilterProductByPrice';
import FlightBookingPage from './FlightBookingPage';
import { fetchCategories, searchactivity } from '../Services/activityServices'; // Combined imports
import { useNavigate, useLocation } from 'react-router-dom';
import ActivityDisplayFilterWise from '../Components/ActivityDisplayFilterWise.js';
import PreferenceChoose from '../Components/Preference.js';
import { Link } from 'react-router-dom';
import DeleteTourist from '../Components/DeleteTouristAcc.js';
import TouristService from '../Services/TouristService';
import ViewCart from './ViewCart'
import CommentPageForTourist from './CommentPageForTourist';
import TouristComplaint from './TouristComplaint';
import ViewMyComplaint  from './ViewMyComplaint';
import Booking from '../Components/booking.js';
import RatePageForTourist from './RatePageForTourist';
import Notification from './TourGuideNotifications';

import Navbar from '../Components/Navbar';
const TouristPage = ({email}) => {
  const location = useLocation();

  // Directly read 'login' from location.state
  const login = location.state?.login || false;
  if(login){
    const userData = JSON.parse(localStorage.getItem('userData'));
    email = userData?.email;
  }
  console.log("email from localStorge", email);
  const navigate = useNavigate();
  const [showChild, setShowChild] = useState(true);
  const [touristData, setTouristData] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [oldEmail, setOldEmail] = useState(email);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [ShowItenaryPage, setShowFilterItenaryPage] = useState(false);
  const [showHistoricalPlace, setShowFilterHistoricalPage] = useState(false);
  const [showProductFilterPage, setShowProductFilterPage] = useState(false);
  const [activities, setActivities] = useState([]); // To store activities for the selected category
  const [categories, setCategories] = useState([]); // Store all the categories
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [touristId, setTouristId] = useState(null);
  const [ShowBookFlightPage, setShowBookFlightPage] = useState(false);
  const [showCommentPage,setShowCommentPage]=useState(false);
  const [showComplaintPage,setShowComplaintPage]=useState(false);
  const [showViewComplaintsPage,SetshowviewComplaintsPage]=useState(false);
  const [ShowBookingPage,SetShowBookingPage]=useState(false);
  const [showRatePage, setShowRatePage] = useState(false);
  const [activeCategories, setActiveCategories] = useState({}); 
  const [ShowOrdersPage,SetShowOrdersPage]=useState(false);
  const [ShowCart,SetShowCart]=useState(false);
  useEffect(() => {
    const getCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories(); // Fetch all categories
        setCategories(fetchedCategories); // Set the categories in state
      } catch (error) {
        setActivityError('Error fetching categories');
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const getTouristData = async () => {
      const response = await fetchTouristByEmail({ email });
      if (response) {
        setTouristData(response.data);
        setEditedData(response.data);
        setTouristId(response.data._id);
        setWallet(response.data.wallet);
      }
    };
    getTouristData();
  }, []);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleUpdateProfile = () => {
    setIsEditing(!isEditing);
    setShowProfileInfo(!showProfileInfo);
    if(!isEditing){
      const userInput = prompt("Please enter your password:");
      if( userInput !== touristData.password){
        return
      }
      
    } // Toggle profile info

    if (isEditing) {
      if (editedData.email !== oldEmail) {
        setOldEmail(editedData.email);
      }
      setTouristData(editedData);
      updateTouristByEmail(oldEmail, editedData);
      const userInput2 = prompt("Please confirm password:");
      if( userInput2 !== touristData.password && isEditing){
        return
      }
    }
  };
  const handleDeleteReq = async () => {
    try {
        // Set the 'delete' field to true for the seller
        let editedData = { delete : true };

        // Assuming 'sellerData' contains the email or ID of the seller you want to update
        const response = await updateTouristByEmail(touristData.email,editedData );  // or sellerData._id if you're using ID instead of email
       
        // Check if the update was successful
        if (response.success) {
            console.log("tourist marked for deletion:", response);
            alert("tourist has been marked for deletion.");
            // Handle success (e.g., update UI or alert user)
        } else {
            console.error("Failed to mark tourist for deletion:", response.message);
            // Handle failure (e.g., show error message)
        }
        console.log("resp" ,response)
    } catch (error) {
        console.error("Error updating tourist:", error);
        // Handle error (e.g., show error message)
    }
};

  const navigateToActivitySorted = () => {
    navigate('/tourist/activities');
  }

  const navigateToupcoming = (touristEmail) => {
    console.log("Navigating with email:", touristEmail);
    navigate('/tourist/upcoming', { state: { email: touristEmail } });
  }

  const navigateToSearch = () => {
    navigate('/tourist/search');
  }

  const handleViewBookedFlightsPageClick = () => {
    console.log("touristdata ahe :", touristData.bookedFlightOffers);
    navigate('/tourist/viewBookedFlights', { state: { bookedFlightsIds : touristData.bookedFlightOffers } });
  };

  const handleBookTransportationPageClick = (touristEmail) => {
    navigate('/tourist/bookTransportation', { state: { email: touristEmail } });
  };

  const handleViewTransportation = (touristEmail) => {
    navigate('/tourist/viewBookedTransportation', { state: { email: touristEmail } });
  };

  const handleViewBookedHotels = () => {
    navigate('/tourist/viewBookedHotels', { state: { bookedHotelsIds : touristData.bookedHotelOffers } });
  };

  const handleHotelFlightPageClick = (touristId) =>{
    navigate('/tourist/SearchHotel', {state : {touristId : touristId}})
  }

  const handleViewMyWishList = (touristId) =>{
    navigate('/tourist/viewWishList', {state : {touristId : touristId, email: email}})
  }

  const handleViewMyBalance = async (email) => {
    try {
      
      const response = await fetchTouristByEmail({ email });
      if (response) {
        setTouristData(response.data);  // Update the state with the response data
        setEditedData(response.data);    // Update the edited data
        setTouristId(response.data._id); // Update the tourist ID
        navigate('/tourist/viewBalance', { state: { touristData: response.data } }); // Pass the updated data directly
      }
    } catch (error) {
      console.error('Error fetching tourist data:', error);
    }
  };

  // const handleCategoryClick = async (categoryName) => {
  //   setLoadingActivities(true); // Show loading indicator
  //   setActivityError(null); // Reset error

  //   try {
  //     const activityResults = await searchactivity({ category: categoryName }); // Fetch activities by category
  //     setActivities(activityResults); // Set the activities to display
  //   } catch (error) {
  //     setActivityError('Error fetching activities for this category');
  //   } finally {
  //     setLoadingActivities(false); // Stop loading
  //   }
  // };

  const handleFilterActivitiesClick = () => setShowFilterPage(true);
  const handleBackToTouristPage = () => setShowFilterPage(false);
  const handleFilterItenariesClick = () => setShowFilterItenaryPage(true);
  const handleBackToTouristPageFromItenaryFilterPage = () => setShowFilterItenaryPage(false);
  const handleFilterHistoricalPlacesClick = () => setShowFilterHistoricalPage(true);
  const handleBackToTouristPageFromFilterHistoricalPlacesPage = () => setShowFilterHistoricalPage(false);
  const handleFilterProductPageClick = () => setShowProductFilterPage(true);
  const handleBackToTouristPageFromFilterProductPage = () => setShowProductFilterPage(false);
  const handleBookFlightPageClick = () => setShowBookFlightPage(true);
  const handleBackToTouristPageFromBookFlightPage = () => setShowBookFlightPage(false);
  const handleCommentClick =()=>setShowCommentPage(true);
  const handleBackToTouristPageFromCommentPage =()=>setShowCommentPage(false);
 const handleComplaintpageClick =()=>setShowComplaintPage(true);
 const handleComplaintViewPageClick =()=>SetshowviewComplaintsPage(true);
 const handleBookingPageClick =()=>SetShowBookingPage(true);
 const handleRateClick =()=>setShowRatePage(true);
 const handleBackToTouristPageFromRatePage =()=>setShowRatePage(false);
 const handleViewOrdersPage = ()=>SetShowOrdersPage(true);
 const handleBackFromOrderPage =()=>SetShowOrdersPage(false);
 const handleViewCart =()=>SetShowCart(true);
 const handleBackFromViewCart =()=>SetShowCart(false);
 const handleViewBookmarkedActivities = () => {
    navigate('/tourist/viewBookmarkedActivities', { state: { email: email } });
  };
  if(ShowCart) return <ViewCart onBack={handleBackFromViewCart} TouristID={touristId}/>
  if(ShowOrdersPage) return <TouristOrders touristId={touristId}/>
  if (showFilterPage) return <FilterActivitiesPage onBack={handleBackToTouristPage} />;
  if (ShowItenaryPage) return <FilterItenaryPage onBack={handleBackToTouristPageFromItenaryFilterPage} />;
  if (showHistoricalPlace) return <FilterHistoricalPage onBack={handleBackToTouristPageFromFilterHistoricalPlacesPage} />;
  if (showProductFilterPage) return <FilterProductByPrice onBack={handleBackToTouristPageFromFilterProductPage} />;
  if (ShowBookFlightPage) return <FlightBookingPage onBack={handleBackToTouristPageFromBookFlightPage} touristId={touristId}/>
  if (showCommentPage)return <CommentPageForTourist onBackClick = {handleBackToTouristPageFromCommentPage} email={email} touristId={touristId}/>
  if (showViewComplaintsPage)return <ViewMyComplaint email ={email}/>;
  if(showComplaintPage)return <TouristComplaint email ={email}/>;
  if(ShowBookingPage)return <Booking touristId={touristId} wallet={wallet}/>;
  if (showRatePage)return <RatePageForTourist onBackClick = {handleBackToTouristPageFromRatePage} email={email} touristId={touristId}/>

  const handleCategoryClick = async (categoryName) => {
    // Toggle category's active state
    setActiveCategories(prevState => {
      const newState = { ...prevState };
      newState[categoryName] = !newState[categoryName];
      return newState;
    });

    if (!activeCategories[categoryName]) { // If category is being activated
      setLoadingActivities(true); // Show loading indicator
      setActivityError(null); // Reset error
      try {
        const activityResults = await searchactivity({ category: categoryName });
        setActivities(activityResults);
      } catch (error) {
        setActivityError('Error fetching activities for this category');
      } finally {
        setLoadingActivities(false); // Stop loading
      }
    } else {
      setActivities([]); // Hide activities if category is deactivated
    }
  };
  return (
    <div className={styles['tourist-page']}> {/* Use the CSS Module for this div */}
      <button
        className={styles['toggle-btn']} // Use the CSS Module for button
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Navigation Bar */}
      <div>
        <Navbar email={touristData?.email} />
        {/* Content of the page */}
      </div>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles['category-buttons2']}>
          <h3>Quick Links</h3>
          <button onClick={handleFilterActivitiesClick} className={styles.button2}>Filter Activities</button>
          <button onClick={handleFilterItenariesClick} className={styles.button2}>Filter Itineraries</button>
          <button onClick={handleFilterHistoricalPlacesClick} className={styles.button2}>Filter Historical Places</button>
          <button onClick={handleFilterProductPageClick} className={styles.button2}>Filter Products</button>
          <button onClick={handleBookFlightPageClick} className={styles.button2}>Book a Flight</button>
          <button onClick={handleCommentClick} className={styles.button2}>Comment</button>
          <button onClick={handleRateClick} className={styles.button2}>Rate</button>
          <button onClick={handleComplaintpageClick} className={styles.button2}>Complaint</button>
          <button onClick={handleComplaintViewPageClick} className={styles.button2}>View_My_Complaints</button>
          <button onClick={handleBookingPageClick} className={styles.button2}>Book itineraries/activities</button>
          <button onClick={handleViewBookedFlightsPageClick} className={styles.button2}>View my Booked Flights</button>
          <button onClick={() => handleHotelFlightPageClick(touristId)} className={styles.button2}>Book a Hotel</button>
          <button onClick={() => handleViewBookedHotels(touristId)} className={styles.button2}>View my Booked Hotels</button>
          <button onClick={() => handleBookTransportationPageClick(touristData?.email)} className={styles.button2}>Book a Transportation</button>
          <button onClick={() => handleViewTransportation(touristData?.email)} className={styles.button2}>View my Transportations</button>
          <button onClick={() => handleViewMyBalance(email)} className={styles.button2}>View my Balance</button>
          <button onClick={() => handleViewMyWishList(touristId)} className={styles.button2}> View My Wish List</button>
          <button onClick={handleViewBookmarkedActivities} className={styles.button2}>View Bookmarked Activities</button>
          <button onClick={handleViewCart} className={styles.button2}>View Cart</button>
          <button onClick={handleViewOrdersPage} className={styles.button2}>View Orders</button>
          <div className="notification-container"></div>
        </div>
      </div>

      <div className={`${styles.container} ${isSidebarOpen ? styles.shifted : ''}`}>
        <header className={styles.header}>
          <h1>Welcome, Tourist!</h1>
        </header>

        <button className={styles.button} onClick={handleUpdateProfile}>
          {isEditing ? 'Save Changes' : 'Update Profile'}
        </button>

        {showProfileInfo && (
          <div className={styles['category-buttons3']}>
            <h2 className={styles['form-header']}>Your Profile</h2>
            <div className={styles['profile-info']}>
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
            <div className={styles['profile-info']}>
              <label>Password:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="password"
                  value={editedData?.password || ''}
                  onChange={handleEditChange}
                />
              ) : (
                <p>{touristData?.password || 'NA'}</p>
              )}
            </div>
            <div className={styles['profile-info']}>
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
            <div className={styles['profile-info']}>
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
            <div className={styles['profile-info']}>
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
            <div className={styles['profile-info']}>
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
            <div className={styles['profile-info']}>
              <label>Date of Birth:</label>
              <p>{touristData?.dob || 'NA'}</p>
            </div>
            <div className={styles['profile-info']}>
              <label>Wallet Balance:</label>
              <p>${touristData?.wallet || 'NA'}</p>
            </div>
            {/* <DeleteTourist email={email }/> */}
            <button className={styles.button3} onClick={() => handleDeleteReq()}> send delete request</button>
          </div>
        )}

        <div className={styles['category-buttons']}>
          <h2>Categories to look at:</h2>
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.name)} // Toggle category state
                className={`${styles.button} ${activeCategories[category.name] ? styles.active : ''}`}
              >
                {category.name}
              </button>
            ))
          ) : (
            <p>No categories available.</p>
          )}
        </div>

        {/* Loading Indicator */}
        {loadingActivities && <p>Loading activities...</p>}

        {/* Error Message */}
        {activityError && <p className={styles.error}>{activityError}</p>}

        {/* Display Selected Activities */}
        {activities.length > 0 && (
         <div className={styles["category-buttons"]}>
            <h2>Available Activities:</h2>
            <ul>
              {activities.map((activity, index) => (
                <ActivityDisplayFilterWise activity={activity} key={index} />
              ))}
            </ul>
          </div>
        )}

        <div className={styles['category-buttons']}>
          <h2>You may also:</h2>
          <button className={styles.button} onClick={() => navigateToupcoming(touristData?.email)}>Look up upcoming activities / itineraries</button>
          <button className={styles.button} onClick={navigateToActivitySorted}>Look up activity sorted</button>
          <button className={styles.button} onClick={navigateToSearch}>Search For activity / musuem / itinerary</button>
          <button className={styles.button} onClick={() => navigate('/tourist/preference')}>Choose Your Preferences</button>
          <ProductSort email={email} touristId={touristId} />
        </div>

        <button className={styles.button} onClick={() => navigate("/")}>Back to login page</button>
        <footer className={styles.footer}>
          <p>&copy; 2024 TravelApp. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
  
};

export default TouristPage;
