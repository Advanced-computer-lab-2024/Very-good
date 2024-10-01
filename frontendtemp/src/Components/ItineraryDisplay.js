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
