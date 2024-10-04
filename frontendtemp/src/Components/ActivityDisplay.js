import React, { useState, useEffect } from 'react';
import './ActivityDisplay.css';
import { fetchCategoryById, fetchCategories } from '../Services/activityServices'; // Import fetchCategories

const ActivityDisplay = ({ activity, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedActivity, setUpdatedActivity] = useState(activity);
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]); // State to hold categories

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedActivity({
      ...updatedActivity,
      [name]: value,
    });
  };

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

  // Fetch categories on component mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        const allCategories = await fetchCategories(); // Fetch all categories
        setCategories(allCategories); // Assuming it returns an array of categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    getCategories();
  }, []);

  const handleSaveClick = async () => {
    const updatedActivityWithNumbers = {
      ...updatedActivity,
      price: parseFloat(updatedActivity.price) || 0,
      duration: parseFloat(updatedActivity.duration) || 0,
      specialDiscount: parseFloat(updatedActivity.specialDiscount) || 0,
      location: {
        ...updatedActivity.location,
        lat: parseFloat(updatedActivity.location.lat) || 0,
        lng: parseFloat(updatedActivity.location.lng) || 0,
      },
    };

    try {
      await onUpdate(activity._id, updatedActivityWithNumbers);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update activity:', err.message);
    }
  };

  return (
    <div className="activity-card">
      {isEditing ? (
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
          
          {/* Dropdown for Category */}
          <select
            name="categoryId"
            value={updatedActivity.categoryId} // Bind the selected value to categoryId
            onChange={(e) => {
              const selectedCategoryId = e.target.value;
              setUpdatedActivity({
                ...updatedActivity,
                categoryId: selectedCategoryId, // Update the categoryId
              });
              const selectedCategory = categories.find(category => category._id === selectedCategoryId);
              setCategoryName(selectedCategory ? selectedCategory.name : ''); // Update categoryName
            }}
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name} {/* Display category name */}
              </option>
            ))}
          </select>

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
                name={`tag-${index}`}
                value={tag.name}
                onChange={(e) => {
                  const newTags = [...updatedActivity.tags];
                  newTags[index].name = e.target.value;
                  setUpdatedActivity({
                    ...updatedActivity,
                    tags: newTags,
                  });
                }}
                placeholder={`Tag ${index + 1}`}
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
                  lat: parseFloat(e.target.value),
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
                  lng: parseFloat(e.target.value),
                },
              })
            }
            placeholder="Location Longitude"
          />
          <button className="save-button" onClick={handleSaveClick}>Save</button>
          <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2 className="activity-title">{activity.name}</h2>
          <p className="activity-date">Date: {new Date(activity.date).toLocaleDateString()}</p>
          <p className="activity-price">Price: ${activity.price}</p>
          <p className="activity-duration">Duration: {activity.duration} minutes</p>
          <p className="activity-category">Category: {categoryName}</p>
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
