import React, { useState, useEffect } from 'react';
import { createActivity, fetchCategories } from '../Services/activityServices'; // Adjust the import path as needed

const CreateActivityForm = ({ onClose, advertiserId }) => {
    const [newActivity, setNewActivity] = useState({
        name: '',
        date: '',
        price: '',
        duration: '',
        categoryId: '', // Replace 'category' with 'categoryId'
        ratings: '',
        specialDiscount: '',
        tags: [{ name: '' }],
        bookingOpen: false,
        location: { lat: '', lng: '' },
        time: { hours: '', minutes: '' },
    });

    const [availableCategories, setAvailableCategories] = useState([]); // State to store fetched categories

    useEffect(() => {
        // Fetch categories when component mounts
        const getCategories = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                setAvailableCategories(fetchedCategories); // Set the fetched categories
            } catch (err) {
                console.error('Failed to fetch categories:', err.message);
            }
        };
        getCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewActivity(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveClick = async () => {
        const { name, date, duration, location, price, time, categoryId, ratings, specialDiscount } = newActivity;
        const requiredFields = [
            name,
            date,
            duration,
            location.lat,
            location.lng,
            price,
            time.hours,
            time.minutes,
            categoryId, // Ensure categoryId is selected
        ];

        const numericFields = {
            duration: parseInt(duration, 10),
            price: parseFloat(price),
            ratings: parseFloat(ratings),
            specialDiscount: parseFloat(specialDiscount),
            locationLat: parseFloat(location.lat),
            locationLng: parseFloat(location.lng),
            timeHours: parseInt(time.hours, 10),
            timeMinutes: parseInt(time.minutes, 10),
        };
    
        for (const [field, value] of Object.entries(numericFields)) {
            if (isNaN(value) || value < 0) {
                alert(`Please enter a valid number for ${field.charAt(0).toUpperCase() + field.slice(1)}.`);
                return; // Exit the function to prevent saving
            }
        }
    
        // If any required field is empty, alert the user
        if (requiredFields.some(field => field === '' || field === undefined)) {
            alert('Please fill in all required fields: Name, Date, Duration, Location (Lat & Lng), Price, Time (Hours & Minutes), and Category.');
            return;
        }
    
        // Create activity data with advertiser ID
        const activityWithAdvertiserId = {
            ...newActivity,
            advertiserId: advertiserId,
            location: {
                lat: numericFields.locationLat,
                lng: numericFields.locationLng,
            },
            time: {
                hours: numericFields.timeHours,
                minutes: numericFields.timeMinutes,
            },
        };
    
        try {
            console.log(activityWithAdvertiserId)
            const createdActivity = await createActivity(activityWithAdvertiserId);
            console.log('Activity created:', createdActivity);
            onClose();
        } catch (err) {
            console.error('Failed to create activity:', err.message);
            alert(`Failed to create activity: ${err.message}`);
        }
    };

    const handleAddTag = () => {
        setNewActivity(prevState => ({
            ...prevState,
            tags: [...prevState.tags, { name: '' }],
        }));
    };

    return (
        <div className="activity-card">
            <input type="text" name="name" value={newActivity.name} onChange={handleInputChange} placeholder="Activity Name" />
            <input type="date" name="date" value={newActivity.date} onChange={handleInputChange} />
            <input type="number" name="price" value={newActivity.price} onChange={handleInputChange} placeholder="Price" />
            <input type="number" name="duration" value={newActivity.duration} onChange={handleInputChange} placeholder="Duration (minutes)" />

            {/* Dropdown for category selection */}
            <select name="categoryId" value={newActivity.categoryId} onChange={handleInputChange}>
                <option value="">Select a Category</option>
                {availableCategories.map(category => (
                    <option key={category._id} value={category._id}>
                        {category.name}
                    </option>
                ))}
            </select>

            <input type="text" name="ratings" value={newActivity.ratings} onChange={handleInputChange} placeholder="Ratings" />
            <input type="number" name="specialDiscount" value={newActivity.specialDiscount} onChange={handleInputChange} placeholder="Special Discount (%)" />

            <div className="activity-tags">
                {newActivity.tags.map((tag, index) => (
                    <input
                        key={index}
                        type="text"
                        name={`tag-${index}`}
                        value={tag.name}
                        onChange={(e) => {
                            const newTags = [...newActivity.tags];
                            newTags[index].name = e.target.value;
                            setNewActivity({ ...newActivity, tags: newTags });
                        }}
                        placeholder={`Tag ${index + 1}`}
                    />
                ))}
                <button onClick={handleAddTag}>Add Tag</button>
            </div>

            <input
                type="checkbox"
                name="bookingOpen"
                checked={newActivity.bookingOpen}
                onChange={(e) => setNewActivity({ ...newActivity, bookingOpen: e.target.checked })}
            />
            Booking Open

            <input
                type="text"
                name="locationLat"
                value={newActivity.location.lat}
                onChange={(e) => setNewActivity({ ...newActivity, location: { ...newActivity.location, lat: e.target.value } })}
                placeholder="Location Latitude"
            />
            <input
                type="text"
                name="locationLng"
                value={newActivity.location.lng}
                onChange={(e) => setNewActivity({ ...newActivity, location: { ...newActivity.location, lng: e.target.value } })}
                placeholder="Location Longitude"
            />

            <input
                type="number"
                name="timeHours"
                value={newActivity.time.hours}
                onChange={(e) => setNewActivity({
                    ...newActivity,
                    time: {
                        ...newActivity.time,
                        hours: e.target.value,
                    },
                })}
                placeholder="Hours"
            />
            <input
                type="number"
                name="timeMinutes"
                value={newActivity.time.minutes}
                onChange={(e) => setNewActivity({
                    ...newActivity,
                    time: {
                        ...newActivity.time,
                        minutes: e.target.value,
                    },
                })}
                placeholder="Minutes"
            />

            <button className="save-button" onClick={handleSaveClick}>Save</button>
            <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
    );
};

export default CreateActivityForm;
