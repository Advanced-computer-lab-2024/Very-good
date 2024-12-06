import React, { useState, useEffect } from 'react';
import styles from '../styles/GuestPage.module.css'; // Keep your existing global styles
import FilterActivitiesPage from './FilterActivitiesPage';
import UploadDocumentsTourGuide from './UploadDocumentsTourGuide';
import FilterItenaryPage from './FilterItenaryPage';
import FilterHistoricalPage from './FilterHistoricalPage';
import FilterProductByPrice from './FilterProductByPrice';
import ActivityHistoricalList from '../Components/UpcomingSort.js';
import { fetchCategories } from '../Services/activityServices'; // Import fetchCategories service
import { searchactivity } from '../Services/activityServices'; // Import searchactivity service
import { useNavigate } from 'react-router-dom';
import ActivityDisplayFilterWise from '../Components/ActivityDisplayFilterWise.js';

const GuestPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [showItenaryPage, setShowItenaryPage] = useState(false);
  const [showHistoricalPlace, setShowFilterHistoricalPage] = useState(false);
  const [showProductFilterPage, setShowProductFilterPage] = useState(false);
  const [showViewPage, setShowViewPage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [showSignInDropdown, setShowSignInDropdown] = useState(false);
  const [UploadTourGuide, setShowUploadTourGuide] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activeCategories, setActiveCategories] = useState({});
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFilterActivitiesClick = () => {
    setShowFilterPage(true);
  };

  const handleBackToGuestPage = () => {
    setShowFilterPage(false);
  };

  const handleFilterItenariesClick = () => {
    setShowItenaryPage(true);
  };

  const handleBackToGuestPageFromItenaryFilterPage = () => {
    setShowItenaryPage(false);
  };

  const handleFilterHistoricalPlacesClick = () => {
    setShowFilterHistoricalPage(true);
  };

  const handleBackToGuestPageFromFilterHistoricalPlacesPage = () => {
    setShowFilterHistoricalPage(false);
  };

  const handleFilterProductPageClick = () => {
    setShowProductFilterPage(true);
  };

  const handleBackToGuestPageFromFilterProductPage = () => {
    setShowProductFilterPage(false);
  };

  const handleViewUpcomingActivitiesItenariesHistoricalPlaces = () => {
    setShowViewPage(true);
  };

  const handleCategoryClick = async (categoryName) => {
    setLoadingActivities(true); // Show loading indicator
    setActivityError(null); // Reset error

    // Toggle active category
    setActiveCategories((prevState) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName], // Toggle category active state
    }));

    if (!activeCategories[categoryName]) { // If category is being activated
      try {
        const activityResults = await searchactivity({ category: categoryName });
        setActivities(activityResults);
      } catch (error) {
        setActivityError('Error fetching activities for this category');
      } finally {
        setLoadingActivities(false); // Stop loading
      }
    } else {
      setActivities([]); // Clear activities if category is deactivated
    }
  };

  const handleSignInClick = () => {
    setShowSignInDropdown(!showSignInDropdown); // Toggle dropdown visibility
  };

  const handleSignInonClickTourist = () => {
    setShowSignInDropdown(false);
    // Navigate to the registration page for Tourist
    navigate("/", { state: { role: "tourist" } });
  };

  const handleSignInonClickTourguide = () => {
    setShowSignInDropdown(false);
    // Navigate to the registration page for Tour Guide
    navigate("/", { state: { role: "tourGuide" } });
  };

  const handleSignInonClickAdvertiser = () => {
    setShowSignInDropdown(false);
    // Navigate to the registration page for Advertiser
    navigate("/", { state: { role: "advertiser" } });
  };

  const handleSignInonClickSeller = () => {
    setShowSignInDropdown(false);
    // Navigate to the registration page for Seller
    navigate("/", { state: { role: "seller" } });
  };

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


  if (showViewPage) {
    return <ActivityHistoricalList />;
  }

  if (showFilterPage) {
    return <FilterActivitiesPage onBack={handleBackToGuestPage} />;
  }

  if (showItenaryPage) {
    return <FilterItenaryPage onBack={handleBackToGuestPageFromItenaryFilterPage} />;
  }

  if (showHistoricalPlace) {
    return <FilterHistoricalPage onBack={handleBackToGuestPageFromFilterHistoricalPlacesPage} />;
  }

  if (showProductFilterPage) {
    return <FilterProductByPrice onBack={handleBackToGuestPageFromFilterProductPage} />;
  }

  if (UploadTourGuide) {
    return <UploadDocumentsTourGuide />;
  }

  return (
    <div className={styles.guestPage}>
      {/* Sidebar Toggle Button */}
  <button  className={styles['toggle-btn']} onClick={toggleSidebar}>
    {isSidebarOpen ? 'Close' : 'Menu'}
  </button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
      <div className={styles['category-buttons2']}>
          <h3>Quick Links</h3>
          <button onClick={handleFilterActivitiesClick} className={styles.button2}>
            Filter Activities
          </button>
          <button onClick={handleFilterItenariesClick} className={styles.button2}>
            Filter Itineraries
          </button>
          <button onClick={handleFilterHistoricalPlacesClick} className={styles.button2}>
            Filter Historical Places
          </button>
          <button onClick={handleViewUpcomingActivitiesItenariesHistoricalPlaces} className={styles.button2}>
            View Upcoming Act/Itin/HistorcPlaces
          </button>
          <button onClick={handleSignInClick} className={styles.button2}>
            Sign In
          </button>

          {/* Sign In Dropdown */}
          {showSignInDropdown && (
            <div className={styles.signInDropdown}>
              <button onClick={handleSignInonClickTourist} className={styles.button2}>Tourist</button>
              <button onClick={handleSignInonClickTourguide}className={styles.button2}>Tour Guide</button>
              <button onClick={handleSignInonClickAdvertiser}className={styles.button2}>Advertiser</button>
              <button onClick={handleSignInonClickSeller}className={styles.button2}>Seller</button>
            </div>
          )}
        </div>
      </div>

      <div className={`${styles.container} ${isSidebarOpen ? styles.shifted : ''}`}>
        <header className={styles.header}>
          <h1 className={styles.h1}>Welcome, Guest!</h1>
        </header>

        <div className={styles['category-buttons']}>
          <h2 className={styles.h2}>Categories to look at:</h2>
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
          <div className={styles.activitiesList}>
            <h2>Available Activities:</h2>
            <ul>
              {activities.map((activity, index) => (
                <ActivityDisplayFilterWise key={index} activity={activity} />
              ))}
            </ul>
          </div>
        )}

        {/* Display Activities */}
        {selectedActivities.length > 0 && (
          <div className={styles.activitiesList}>
            <h2>Activities:</h2>
            {selectedActivities.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <h3>{activity.name}</h3>
                <p>{activity.description}</p>
              </div>
            ))}
          </div>
        )}
        <button className={styles.button} onClick={() => navigate("/")}>Back to login page</button>
      </div>
    </div>
  );
};

export default GuestPage;