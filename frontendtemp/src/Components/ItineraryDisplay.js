import React, { useState } from 'react';
import './ActivityDisplay.css';

const ItineraryDisplay = ({ itinerary, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false); // State to toggle between edit and view mode
  const [updatedItinerary, setUpdatedItinerary] = useState(itinerary); // Copy of the itinerary to hold updated values

  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'price' ? parseFloat(value) : value; // Convert to float for price
    setUpdatedItinerary({
      ...updatedItinerary,
      [name]: newValue,
    });
  };

  const handleSaveClick = async () => {
    try {
      await onUpdate(itinerary._id, updatedItinerary); // Call the update function passed as prop
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error('Failed to update itinerary:', err.message);
    }
  };

  return (
    <div className="activity-card">
      {isEditing ? (
        // Render form fields in editing mode
        <>
          <input
            type="text"
            name="title"
            value={updatedItinerary.title}
            onChange={handleInputChange}
            placeholder="Itinerary Title"
          />
          <textarea
            name="description"
            value={updatedItinerary.description}
            onChange={handleInputChange}
            placeholder="Itinerary Description"
          />
          <input
            type="number"
            name="price"
            value={updatedItinerary.price}
            onChange={handleInputChange}
            placeholder="Total Price"
          />
          <input
            type="text"
            name="language"
            value={updatedItinerary.language}
            onChange={handleInputChange}
            placeholder="Language"
          />
          <input
            type="text"
            name="pickUpLocation"
            value={updatedItinerary.pickUpLocation}
            onChange={handleInputChange}
            placeholder="Pick Up Location"
          />
          <input
            type="text"
            name="dropOffLocation"
            value={updatedItinerary.dropOffLocation}
            onChange={handleInputChange}
            placeholder="Drop Off Location"
          />

          {/* Edit activities */}
          <div className="activities-container">
            <h3>Activities</h3>
            {updatedItinerary.activities.map((activity, index) => (
              <div key={index}>
                <input
                  type="text"
                  name={`activityTitle-${index}`}
                  value={activity.title}
                  onChange={(e) => {
                    const newActivities = [...updatedItinerary.activities];
                    newActivities[index].title = e.target.value;
                    setUpdatedItinerary({
                      ...updatedItinerary,
                      activities: newActivities,
                    });
                  }}
                  placeholder="Activity Title"
                />
                <input
                  type="number"
                  name={`activityDuration-${index}`}
                  value={activity.duration}
                  onChange={(e) => {
                    const newActivities = [...updatedItinerary.activities];
                    newActivities[index].duration = parseFloat(e.target.value);
                    setUpdatedItinerary({
                      ...updatedItinerary,
                      activities: newActivities,
                    });
                  }}
                  placeholder="Duration (minutes)"
                />
                <input
                  type="number"
                  name={`activityPrice-${index}`}
                  value={activity.price}
                  onChange={(e) => {
                    const newActivities = [...updatedItinerary.activities];
                    newActivities[index].price = parseFloat(e.target.value);
                    setUpdatedItinerary({
                      ...updatedItinerary,
                      activities: newActivities,
                    });
                  }}
                  placeholder="Price"
                />
              </div>
            ))}
          </div>

          {/* Edit locations to visit */}
          <div className="locations-container">
            <h3>Locations to Visit</h3>
            {updatedItinerary.locationsToVisit.map((location, index) => (
              <div key={index}>
                <input
                  type="text"
                  name={`locationName-${index}`}
                  value={location.name}
                  onChange={(e) => {
                    const newLocations = [...updatedItinerary.locationsToVisit];
                    newLocations[index].name = e.target.value;
                    setUpdatedItinerary({
                      ...updatedItinerary,
                      locationsToVisit: newLocations,
                    });
                  }}
                  placeholder="Location Name"
                />
              </div>
            ))}
          </div>

          {/* Edit available dates */}
          <div className="dates-container">
            <h3>Available Dates</h3>
            {updatedItinerary.availableDates.map((date, index) => (
              <input
                key={index}
                type="date"
                value={date}
                onChange={(e) => {
                  const newDates = [...updatedItinerary.availableDates];
                  newDates[index] = e.target.value;
                  setUpdatedItinerary({
                    ...updatedItinerary,
                    availableDates: newDates,
                  });
                }}
              />
            ))}
          </div>

          {/* Edit available times */}
          <div className="times-container">
            <h3>Available Times</h3>
            {updatedItinerary.availableTimes.map((time, index) => (
              <input
                key={index}
                type="time"
                value={time}
                onChange={(e) => {
                  const newTimes = [...updatedItinerary.availableTimes];
                  newTimes[index] = e.target.value;
                  setUpdatedItinerary({
                    ...updatedItinerary,
                    availableTimes: newTimes,
                  });
                }}
              />
            ))}
          </div>

          <button className="save-button" onClick={handleSaveClick}>Save</button>
          <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        // Display itinerary details in view mode
        <>
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
                <p>{index+1}. {location.name}</p>
              </div>
            ))}
          </div>
          <h3>Available Dates :</h3>
          <div className="activities-list">
            {itinerary.availableDates.map((date, index) => (
              <div key={index} className="activity-item">
                <p>{index+1}. {date}</p>
              </div>
            ))}
          </div>
          <h3>Available Times :</h3>
          <div className="activities-list">
            {itinerary.availableTimes.map((time, index) => (
              <div key={index} className="activity-item">
                <p>{index+1}. {time}</p>
              </div>
            ))}
          </div>
          <div className="itinerary-buttons">
            <button className="edit-button" onClick={handleEditClick}>Edit</button>
            <button className="delete-button" onClick={() => onDelete(itinerary._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ItineraryDisplay;
