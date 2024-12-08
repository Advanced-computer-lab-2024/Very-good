import React, { useState } from 'react';
import axios from 'axios';  // Import axios
import './ActivityDisplay.css';
import ShareComponent from './shareComponent';
import ViewComments from './viewComments';  // Import ViewComments component

const ItineraryDisplayFilterWise = ({ itinerary, comments = false }) => {
  // State to toggle visibility of comments
  const [showComments, setShowComments] = useState(false);

  // State to store tour guide information
  const [tourGuide, setTourGuide] = useState(null);
  const [showTourGuideComments, setShowTourGuideComments] = useState(false);

  // Function to handle toggle of comments visibility
  const toggleComments = () => {
    setShowComments(prevState => !prevState);
  };

  // Function to handle view tour guide button click
  const viewTourGuide = async () => {
    if (showTourGuideComments) {
      setShowTourGuideComments(false);
      setTourGuide(null);
      return;
    }
    try {
      console.log('Fetching tour guide:', itinerary.tourGuideId);
      const response = await axios.post('http://localhost:4000/api/tourGuides/getById', {
        id: itinerary.tourGuideId,
      });
      setTourGuide(response.data.tourGuide);
      setShowTourGuideComments(true);  // Show comments after fetching tour guide
      console.log('Tour guide:', response.data);
    } catch (error) {
      console.error('Error fetching tour guide:', error);
    }
  };

  return (
    <div className="activity-card">
      <h2 className="itinerary-title">{itinerary.title}</h2>
      <h4 className="itinerary-description">Description: </h4><p>{itinerary.description}</p>
      <h4 className="itinerary-price">Total Price:</h4><p> ${itinerary.price}</p>
      <h4 className="itinerary-language">Language:</h4><p> {itinerary.language}</p>
      <h4 className="itinerary-pickup">Pick Up Location:</h4><p> {itinerary.pickUpLocation}</p>
      <h4 className="itinerary-dropoff">Drop Off Location: </h4><p>{itinerary.dropOffLocation}</p>
      <h4 className="itinerary-rating">Rating:</h4><p>{itinerary.ratings} / 5</p>

      <h3>Activities</h3>
      <div className="activities-list">
        {itinerary.activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <h4>{activity.title} :</h4>
            <p>Duration: {activity.duration} minutes</p>
            <p>Price: ${activity.price}</p>
          </div>
        ))}
      </div>

      <h3>Locations to visit :</h3>
      <div className="activities-list">
        {itinerary.locationsToVisit.map((location, index) => (
          <div key={index} className="activity-item">
            <p>{index + 1}. {location.name}</p>
          </div>
        ))}
      </div>

      <h3>Available Dates :</h3>
      <div className="activities-list">
        {itinerary.availableDates.map((date, index) => (
          <div key={index} className="activity-item">
            <p>{index + 1}. {date}</p>
          </div>
        ))}
      </div>

      <h3>Available Times :</h3>
      <div className="activities-list">
        {itinerary.availableTimes.map((time, index) => (
          <div key={index} className="activity-item">
            <p>{index + 1}. {time}</p>
          </div>
        ))}
      </div>

      {/* View Tour Guide Button */}
      <button className="view-tourguide-button" onClick={viewTourGuide}>
        {tourGuide && showTourGuideComments ? 'Hide Tour Guide' : 'View Tour Guide'}
      </button>

      {/* Display Tour Guide Information */}
      {tourGuide && showTourGuideComments && (
        <div className="tour-guide-info">
          <h4>Tour Guide Name: {tourGuide.name}</h4>
          <p>Email: {tourGuide.email}</p>
          <p>Mobile: {tourGuide.mobile}</p>
          <p>Experience: {tourGuide.yearsOfExperience} years</p>

          {/* Conditionally render Tour Guide Comments */}
          {showTourGuideComments && (
            <div className="tour-guide-comments">
              <button onClick={toggleComments} className="view-comments-button">
          {showComments ? 'Hide Comments on tour guide' : 'View Comments on tour guide'}
        </button>
        {showComments && <ViewComments comments={tourGuide.commentsArray} />}
            </div>
          )}
        </div>
      )}
      

      {comments && (
        <button onClick={toggleComments} className="view-comments-button">
          {showComments ? 'Hide Comments on Itinerary' : 'View Comments on Itinerary'}
        </button>
      )}

      {/* Conditionally render ViewComments component for Itinerary */}
      {comments && showComments && <ViewComments comments={itinerary.commentsArray} />}

      {/* View Comments Button
      {comments && (
        <button onClick={toggleComments} className="view-comments-button">
          {showComments ? 'Hide Comments' : 'View Comments'}
        </button>
      )} */}

      {/* Conditionally render ViewComments component */}

      <div className="itinerary-buttons">
      </div>
      <ShareComponent type="itinerary" id={itinerary._id} />
    </div>
  );
};

export default ItineraryDisplayFilterWise;
