import React from 'react';
import './ActivityDisplay.css';

const ItineraryDisplayFilterWise = ({ itinerary, onDelete }) => {
  return (
    <div className="activity-card">
      <h2 className="itinerary-title">{itinerary.title}</h2>
      <h4 className="itinerary-description">Description: </h4><p>{itinerary.description}</p>
      <h4 className="itinerary-price">Total Price:</h4><p> ${itinerary.price}</p>
      <h4 className="itinerary-language">Language:</h4><p> {itinerary.language}</p>
      <h4 className="itinerary-pickup">Pick Up Location:</h4><p> {itinerary.pickUpLocation}</p>
      <h4 className="itinerary-dropoff">Drop Off Location: </h4><p>{itinerary.dropOffLocation}</p>

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

      <div className="itinerary-buttons">
      </div>
    </div>
  );
};

export default ItineraryDisplayFilterWise;