import React, { useState } from 'react';
import './ActivityDisplay.css';
import ShareComponent from './shareComponent';
import ViewComments from './viewComments';  // Import ViewComments component

const ItineraryDisplayFilterWise = ({ itinerary, comments = false }) => {
  // State to toggle visibility of comments
  const [showComments, setShowComments] = useState(false);

  // Function to handle toggle of comments visibility
  const toggleComments = () => {
    setShowComments(prevState => !prevState);
  };

  return (
    <div className="activity-card">
      <h2 className="itinerary-title" style={{color:"white"}}>{itinerary.title}</h2>
      <h4 className="itinerary-description" style={{color:"white"}}>Description: </h4><p>{itinerary.description}</p>
      <h4 className="itinerary-price" style={{color:"white"}}>Total Price:</h4><p> ${itinerary.price}</p>
      <h4 className="itinerary-language" style={{color:"white"}}>Language:</h4><p> {itinerary.language}</p>
      <h4 className="itinerary-pickup" style={{color:"white"}}>Pick Up Location:</h4><p> {itinerary.pickUpLocation}</p>
      <h4 className="itinerary-dropoff" style={{color:"white"}}>Drop Off Location: </h4><p>{itinerary.dropOffLocation}</p>

      <h3 style={{color:"white"}}>Activities</h3>
      <div className="activities-list">
        {itinerary.activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <h4>{activity.title} :</h4>
            <p>Duration: {activity.duration} minutes</p>
            <p>Price: ${activity.price}</p>
          </div>
        ))}
      </div>

      <h3 style={{color:"white"}}>Locations to visit :</h3>
      <div className="activities-list"  >
        {itinerary.locationsToVisit.map((location, index) => (
          <div key={index} className="activity-item">
            <p>{index + 1}. {location.name}</p>
          </div>
        ))}
      </div>

      <h3 style={{color:"white"}}>Available Dates :</h3>
      <div className="activities-list">
        {itinerary.availableDates.map((date, index) => (
          <div key={index} className="activity-item">
            <p>{index + 1}. {date}</p>
          </div>
        ))}
      </div>

      <h3 style={{color:"white"}}>Available Times :</h3>
      <div className="activities-list" > 
        {itinerary.availableTimes.map((time, index) => (
          <div key={index} className="activity-item">
            <p>{index + 1}. {time}</p>
          </div>
        ))}
      </div>

      {/* View Comments Button */}
      {comments && (
        <button onClick={toggleComments} className="view-comments-button">
          {showComments ? 'Hide Comments' : 'View Comments'}
        </button>
      )}

      {/* Conditionally render ViewComments component */}
      {showComments && <ViewComments comments={itinerary.commentsArray} />}

      <div className="itinerary-buttons">
      </div>
      <ShareComponent type="itinerary" id={itinerary._id} />
    </div>
  );
};

export default ItineraryDisplayFilterWise;
