import React, { useState } from 'react';
import '../styles/global.css'; // Make sure this CSS file contains the styles used in the TouristPage sidebar
import FilterActivitiesPage from './FilterActivitiesPage';
import FilterItenaryPage from './FilterItenaryPage';
import FilterHistoricalPage from './FilterHistoricalPage';
import FilterProductByPrice from './FilterProductByPrice';
import ActivityHistoricalList from '../Components/UpcomingSort.js';
const GuestPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [ShowItenaryPage, setShowFilterItenaryPage] = useState(false);
  const [showHistoricalPlace, setShowFilterHistoricalPage] = useState(false);
  const [showProductFilterPage, setShowProductFilterPage] = useState(false);
  const [ShowViewPage,setShowViewPage]=useState(false);
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
    setShowFilterItenaryPage(true);
  };

  const handleBackToGuestPageFromItenaryFilterPage = () => {
    setShowFilterItenaryPage(false);
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
  const handleViewUpcomingActivitiesitenarieshistroicalplaces=()=>{
    setShowViewPage(true);
  }
  if (ShowViewPage){
   return <ActivityHistoricalList/>
  }
  if (showFilterPage) {
    return <FilterActivitiesPage onBack={handleBackToGuestPage} />;
  }

  if (ShowItenaryPage) {
    return <FilterItenaryPage onBack={handleBackToGuestPageFromItenaryFilterPage} />;
  }

  if (showHistoricalPlace) {
    return <FilterHistoricalPage onBack={handleBackToGuestPageFromFilterHistoricalPlacesPage} />;
  }

  if (showProductFilterPage) {
    return <FilterProductByPrice onBack={handleBackToGuestPageFromFilterProductPage} />;
  }

  return (
    <div className="guest-page">
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
          <button onClick={handleViewUpcomingActivitiesitenarieshistroicalplaces}>View upcoming Activities/ itineraries/ historiocal place</button>
        </div>
      </div>

      <div className={`container ${isSidebarOpen ? 'shifted' : ''}`}>
        <header className="header">
          <h1>Welcome, Guest!</h1>
        </header>

        <footer className="footer">
          <p>&copy; 2024 TravelApp. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default GuestPage;
