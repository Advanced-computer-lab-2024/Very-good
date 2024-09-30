import React, { useState } from 'react';
import { createActivity } from '../Services/activityServices'; // Adjust the import path as needed

const CreateActivityForm = ({ onClose, advertiserId }) => {
    const [newActivity, setNewActivity] = useState({
        name: '',
        date: '',
        price: '',
        duration: '',
        category: '',
        ratings: '',
        specialDiscount: '',
        tags: [{ name: '' }],
        bookingOpen: false,
        location: { lat: '', lng: '' },
        time: { hours: '', minutes: '' },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewActivity(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveClick = async () => {
        try {
            const activityWithAdvertiserId = {
                ...newActivity,
                advertiserId: advertiserId,
                location: {
                    lat: parseFloat(newActivity.location.lat),
                    lng: parseFloat(newActivity.location.lng),
                },
                time: {
                    hours: parseInt(newActivity.time.hours, 10),
                    minutes: parseInt(newActivity.time.minutes, 10),
                },
            };
            console.log(activityWithAdvertiserId);
            const createdActivity = await createActivity(activityWithAdvertiserId);
            console.log('Activity created:', createdActivity);
            onClose(); // Close the form after successful creation
        } catch (err) {
            console.error('Failed to create activity:', err.message);
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
            {/* Form fields */}
            <input type="text" name="name" value={newActivity.name} onChange={handleInputChange} placeholder="Activity Name" />
            <input type="date" name="date" value={newActivity.date} onChange={handleInputChange} />
            <input type="number" name="price" value={newActivity.price} onChange={handleInputChange} placeholder="Price" />
            <input type="number" name="duration" value={newActivity.duration} onChange={handleInputChange} placeholder="Duration (minutes)" />
            <input type="text" name="category" value={newActivity.category} onChange={handleInputChange} placeholder="Category" />
            <input type="text" name="ratings" value={newActivity.ratings} onChange={handleInputChange} placeholder="Ratings" />
            <input type="number" name="specialDiscount" value={newActivity.specialDiscount} onChange={handleInputChange} placeholder="Special Discount (%)" />

            {/* Tags */}
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
