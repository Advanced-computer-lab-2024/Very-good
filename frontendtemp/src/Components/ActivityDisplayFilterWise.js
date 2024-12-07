import React, { useState, useEffect } from 'react';
import './ActivityDisplay.css';
import { fetchCategoryById, fetchCategories } from '../Services/activityServices';
import ShareComponent from './shareComponent';
import ViewComments from './viewComments';  // Import the new ViewComments component
import axios from 'axios'; // Import axios for making API requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon component
import { faBookmark, faBell } from '@fortawesome/free-solid-svg-icons'; // Import the bookmark and bell icons
import styles from '../styles/GuestPage.module.css'; // Keep your existing global styles
const ActivityDisplayFilterWise = ({ activity, comments = false, email }) => {
  console.log("comments : ", comments);

  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [showComments, setShowComments] = useState(false); // State to toggle comments visibility
  const [isBookmarked, setIsBookmarked] = useState(false); // State to track if the activity is bookmarked
  const [isNotified, setIsNotified] = useState(false); // State to track if the user is notified

  useEffect(() => {
    const getCategoryName = async () => {
      try {
        if (activity.categoryId) {
          const category = await fetchCategoryById(activity.categoryId);
          setCategoryName(category.data.name);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };
    getCategoryName();
  }, [activity.categoryId]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const allCategories = await fetchCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    getCategories();
  }, []);

  // Function to handle toggle of comments visibility
  const toggleComments = () => {
    setShowComments(prevState => !prevState);
  };

  // Function to handle bookmarking the activity
  const handleBookmark = async () => {
    try {
      await axios.post('http://localhost:4000/api/tourists/bookmark-activity', {
        email,
        activityId: activity._id
      });
      setIsBookmarked(true);
      alert('Activity bookmarked successfully');
    } catch (error) {
      console.error('Error bookmarking activity:', error);
      alert('Failed to bookmark activity');
    }
  };

  // Function to handle notifying the user
  const handleNotify = async () => {
    try {
        await axios.post('http://localhost:4000/api/activities/addInterestedTourist', {
            email,
            activityId: activity._id
        });
        setIsNotified(true);
        alert('You will be notified about this activity');
    } catch (error) {
        console.error('Error notifying user:', error);
        alert('Failed to set notification for this activity');
    }
  };

  return (
    <div className="activity-card" style={ {width : '60%' , margin : "0 auto ", marginBottom : "3%"}} >
      <div className="icon-container">
        <FontAwesomeIcon 
          icon={faBookmark} 
          onClick={handleBookmark} 
          className={`bookmark-icon ${isBookmarked ? 'bookmarked' : ''}`} 
        />
        <FontAwesomeIcon 
          icon={faBell} 
          onClick={handleNotify} 
          className={`notify-icon ${isNotified ? 'notified' : 'transparent'}`} 
        />
      </div>
      <div className={styles['']}>
      <h2 className="activity-title">{activity.name}</h2>
      <p className="activity-date">Date: {new Date(activity.date).toLocaleDateString()}</p>
      <p className="activity-price">Price: ${activity.price}</p>
      <p className="activity-duration">Duration: {activity.duration} minutes</p>
      <p className="activity-category">Category: {categoryName}</p>
      <p className="activity-ratings">Ratings: {activity.ratings}/5</p>
      <p className="activity-special-discount">Special Discount: {activity.specialDiscount}%</p>
      <p className="activity-booking-status">Booking Open: {activity.bookingOpen ? "Yes" : "No"}</p>
      </div>

      <div className="tags-container">
        {activity.tags.map((tag, index) => (
          <span key={index} className="activity-tag">{tag.name}</span>
        ))}
      </div>

      {/* Share Component */}
      <ShareComponent type="activity" id={activity._id} />

      {/* View Comments Button */}
      {comments && (
        <button onClick={toggleComments} className="view-comments-button">
          {showComments ? 'Hide Comments' : 'View Comments'}
        </button>
      )}

      {/* Conditionally render ViewComments Component */}
      {showComments && <ViewComments comments={activity.commentsArray} />}
    </div>
  );
};

export default ActivityDisplayFilterWise;
