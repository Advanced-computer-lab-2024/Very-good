import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/TouristPage.module.css';

const Navbar = ({ email }) => {
  const navigate = useNavigate();

  // Initialize state for email
  const [emailState, setEmailState] = useState("");

  // If an email is passed as a prop, set it to the state
  useEffect(() => {
    if (email && email !== "") {
      setEmailState(email);
    }
  }, [email]);

  // Function to handle double navigation
  const handleViewBookmarks = () => {
    // First, navigate to home page
    navigate('/tourist');

    // Then, after a short delay, navigate to View Bookmarked Activities
    setTimeout(() => {
      navigate('/tourist/viewBookmarkedActivities', { state: { email: emailState } });
    }, 500);  // Adjust the delay as needed (500ms in this case)
  };

  return (
    <nav className={styles.navbar}> {/* Apply the navbar class from the module */}
      <ul className={styles['nav-links']}> {/* Apply the nav-links class from the module */}
        <li>
          <button className={styles['nav-btn']} onClick={() => navigate('/tourist')}>Home</button> {/* Corrected the class name */}
        </li>
        <li>
          <button className={styles['nav-btn']} onClick={() => navigate('/tourist/preference')}>Preferences</button> {/* Corrected the class name */}
        </li>
        <li>
          <button className={styles['nav-btn']} onClick={() => navigate('/tourist/activities')}>Activities</button> {/* Corrected the class name */}
        </li>
        <li>
          <button className={styles['nav-btn']} onClick={() => navigate('/tourist/SearchHotel')}>Search Hotel</button> {/* Corrected the class name */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
