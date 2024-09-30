import React, { useState } from 'react';
import './ActivityDisplay.css';

const ActivityDisplay = ({ activity, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false); // State to toggle between edit and view mode
  const [updatedActivity, setUpdatedActivity] = useState(activity); // Copy of the activity to hold updated values

  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'price' || name === 'duration' || name === 'specialDiscount' ? parseFloat(value) : value; // Convert to float for specific fields
    setUpdatedActivity({
        ...updatedActivity,
        [name]: newValue,
    });
};

  const handleSaveClick = async () => {
    try {
      await onUpdate(activity._id, updatedActivity); // Call the update function passed as prop
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error('Failed to update activity:', err.message);
    }
  };

  return (
    <div className="activity-card">
      {isEditing ? (
        // Render form fields in editing mode
        <>
          <input
            type="text"
            name="name"
            value={updatedActivity.name}
            onChange={handleInputChange}
            placeholder="Activity Name"
          />
          <input
            type="date"
            name="date"
            value={new Date(updatedActivity.date).toISOString().split('T')[0]}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            value={updatedActivity.price}
            onChange={handleInputChange}
            placeholder="Price"
          />
          <input
            type="number"
            name="duration"
            value={updatedActivity.duration}
            onChange={handleInputChange}
            placeholder="Duration (minutes)"
          />
          <input
            type="text"
            name="category"
            value={updatedActivity.category}
            onChange={handleInputChange}
            placeholder="Category"
          />
          <input
            type="text"
            name="ratings"
            value={updatedActivity.ratings}
            onChange={handleInputChange}
            placeholder="Ratings"
          />
          <input
            type="number"
            name="specialDiscount"
            value={updatedActivity.specialDiscount}
            onChange={handleInputChange}
            placeholder="Special Discount (%)"
          />
        <div className="activity-tags">
            {updatedActivity.tags.map((tag, index) => (
            <input
            key={index}
            type="text"
            name={`tag-${index}`} // Correct string interpolation with backticks and curly braces
            value={tag.name}
            onChange={(e) => {
            const newTags = [...updatedActivity.tags];
            newTags[index].name = e.target.value;
            setUpdatedActivity({
             ...updatedActivity,
            tags: newTags,
            });
            }}
            placeholder={`Tag ${index + 1}`} // Correct string interpolation here as well
         />
         ))}
        </div>

          <input
            type="checkbox"
            name="bookingOpen"
            checked={updatedActivity.bookingOpen}
            onChange={(e) =>
              setUpdatedActivity({
                ...updatedActivity,
                bookingOpen: e.target.checked,
              })
            }
          />
          Booking Open
          <input
            type="text"
            name="locationLat"
            value={updatedActivity.location.lat}
            onChange={(e) =>
              setUpdatedActivity({
                ...updatedActivity,
                location: {
                  ...updatedActivity.location,
                  lat: e.target.value,
                },
              })
            }
            placeholder="Location Latitude"
          />
          <input
            type="text"
            name="locationLng"
            value={updatedActivity.location.lng}
            onChange={(e) =>
              setUpdatedActivity({
                ...updatedActivity,
                location: {
                  ...updatedActivity.location,
                  lng: e.target.value,
                },
              })
            }
            placeholder="Location Longitude"
          />
          
          <button className="save-button" onClick={handleSaveClick}>Save</button>
          <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        // Display activity details in view mode
        <>
          <h2 className="activity-title">{activity.name}</h2>
          <p className="activity-date">Date: {new Date(activity.date).toLocaleDateString()}</p>
          <p className="activity-price">Price: ${activity.price}</p>
          <p className="activity-duration">Duration: {activity.duration} minutes</p>
          <p className="activity-category">Category: {activity.category}</p>
          <p className="activity-ratings">Ratings: {activity.ratings}/5</p>
          <p className="activity-special-discount">Special Discount: {activity.specialDiscount}%</p>
          <p className="activity-booking-status">Booking Open: {activity.bookingOpen ? "Yes" : "No"}</p>
          <p className="activity-location">
            Location: {activity.location.lat}, {activity.location.lng}
          </p>
          <div className="tags-container">
            {activity.tags.map((tag, index) => (
              <span key={index} className="activity-tag">{tag.name}</span>
            ))}
          </div>
          <div className="activity-buttons">
            <button className="edit-button" onClick={handleEditClick}>Edit</button>
            <button className="delete-button" onClick={() => onDelete(activity._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityDisplay;