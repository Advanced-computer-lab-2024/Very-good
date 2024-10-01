import React, { useState } from 'react';
import { createItinerary } from '../Services/itineraryServices'; // Adjust the import path as needed

const CreateItineraryForm = ({ onClose, tourGuideId }) => {
    const [newItinerary, setNewItinerary] = useState({
        title: '',
        description: '',
        price: '',
        language: '',
        pickUpLocation: '',
        dropOffLocation: '',
        activities: [{ title: '', description: '', duration: '', price: '', startTime: '', endTime: '', location: { lat: '', lng: '' } }],
        locationsToVisit: [{ name: '', lat: '', lng: '', address: '' }],
        availableDates: [''],
        availableTimes: [''],
        accessibility: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItinerary(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveClick = async () => {
        try {
            const itineraryWithTourGuideId = {
                ...newItinerary,
                tourGuideId: tourGuideId,
                activities: newItinerary.activities.map(activity => ({
                    ...activity,
                    location: {
                        lat: parseFloat(activity.location.lat),
                        lng: parseFloat(activity.location.lng),
                    },
                })),
                locationsToVisit: newItinerary.locationsToVisit.map(location => ({
                    ...location,
                    lat: parseFloat(location.lat),
                    lng: parseFloat(location.lng),
                })),
            };
            console.log(itineraryWithTourGuideId);
            const createdItinerary = await createItinerary(itineraryWithTourGuideId);
            console.log('Itinerary created:', createdItinerary);
            onClose(); // Close the form after successful creation
        } catch (err) {
            console.error('Failed to create itinerary:', err.message);
        }
    };

    const handleAddActivity = () => {
        setNewItinerary(prevState => ({
            ...prevState,
            activities: [...prevState.activities, { title: '', description: '', duration: '', price: '', startTime: '', endTime: '', location: { lat: '', lng: '' } }],
        }));
    };

    const handleAddLocation = () => {
        setNewItinerary(prevState => ({
            ...prevState,
            locationsToVisit: [...prevState.locationsToVisit, { name: '', lat: '', lng: '', address: '' }],
        }));
    };

    const handleAddAvailableDate = () => {
        setNewItinerary(prevState => ({
            ...prevState,
            availableDates: [...prevState.availableDates, ''],
        }));
    };

    const handleAddAvailableTime = () => {
        setNewItinerary(prevState => ({
            ...prevState,
            availableTimes: [...prevState.availableTimes, ''],
        }));
    };

    return (
        <div className="itinerary-card">
            {/* Form fields */}
            <input type="text" name="title" value={newItinerary.title} onChange={handleInputChange} placeholder="Itinerary Title" />
            <textarea name="description" value={newItinerary.description} onChange={handleInputChange} placeholder="Itinerary Description" />
            <input type="number" name="price" value={newItinerary.price} onChange={handleInputChange} placeholder="Price" />
            <input type="text" name="language" value={newItinerary.language} onChange={handleInputChange} placeholder="Language" />
            <input type="text" name="pickUpLocation" value={newItinerary.pickUpLocation} onChange={handleInputChange} placeholder="Pick Up Location" />
            <input type="text" name="dropOffLocation" value={newItinerary.dropOffLocation} onChange={handleInputChange} placeholder="Drop Off Location" />

            {/* Activities */}
            <div className="itinerary-activities">
                <h3>Activities</h3>
                {newItinerary.activities.map((activity, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name={`activityTitle-${index}`}
                            value={activity.title}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].title = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder={`Activity Title`}
                        />
                        <input
                            type="text"
                            name={`activityDescription-${index}`}
                            value={activity.description}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].description = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder={`Activity Description`}
                        />
                        <input
                            type="number"
                            name={`activityDuration-${index}`}
                            value={activity.duration}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].duration = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="Duration (minutes)"
                        />
                        <input
                            type="number"
                            name={`activityPrice-${index}`}
                            value={activity.price}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].price = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="Price"
                        />
                        <input
                            type="text"
                            name={`activityStartTime-${index}`}
                            value={activity.startTime}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].startTime = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="Start Time"
                        />
                        <input
                            type="text"
                            name={`activityEndTime-${index}`}
                            value={activity.endTime}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].endTime = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="End Time"
                        />
                        <input
                            type="text"
                            name={`activityLocationLat-${index}`}
                            value={activity.location.lat}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].location.lat = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="Activity Location Latitude"
                        />
                        <input
                            type="text"
                            name={`activityLocationLng-${index}`}
                            value={activity.location.lng}
                            onChange={(e) => {
                                const newActivities = [...newItinerary.activities];
                                newActivities[index].location.lng = e.target.value;
                                setNewItinerary({ ...newItinerary, activities: newActivities });
                            }}
                            placeholder="Activity Location Longitude"
                        />
                    </div>
                ))}
                <button onClick={handleAddActivity}>Add Activity</button>
            </div>

            {/* Locations to visit */}
            <div className="itinerary-locations">
                <h3>Locations to Visit</h3>
                {newItinerary.locationsToVisit.map((location, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name={`locationName-${index}`}
                            value={location.name}
                            onChange={(e) => {
                                const newLocations = [...newItinerary.locationsToVisit];
                                newLocations[index].name = e.target.value;
                                setNewItinerary({ ...newItinerary, locationsToVisit: newLocations });
                            }}
                            placeholder={`Location Name`}
                        />
                        <input
                            type="text"
                            name={`locationLat-${index}`}
                            value={location.lat}
                            onChange={(e) => {
                                const newLocations = [...newItinerary.locationsToVisit];
                                newLocations[index].lat = e.target.value;
                                setNewItinerary({ ...newItinerary, locationsToVisit: newLocations });
                            }}
                            placeholder="Location Latitude"
                        />
                        <input
                            type="text"
                            name={`locationLng-${index}`}
                            value={location.lng}
                            onChange={(e) => {
                                const newLocations = [...newItinerary.locationsToVisit];
                                newLocations[index].lng = e.target.value;
                                setNewItinerary({ ...newItinerary, locationsToVisit: newLocations });
                            }}
                            placeholder="Location Longitude"
                        />
                        <input
                            type="text"
                            name={`locationAddress-${index}`}
                            value={location.address}
                            onChange={(e) => {
                                const newLocations = [...newItinerary.locationsToVisit];
                                newLocations[index].address = e.target.value;
                                setNewItinerary({ ...newItinerary, locationsToVisit: newLocations });
                            }}
                            placeholder="Location Address"
                        />
                    </div>
                ))}
                <button onClick={handleAddLocation}>Add Location</button>
            </div>

            {/* Available Dates */}
            <div className="itinerary-dates">
                <h3>Available Dates</h3>
                {newItinerary.availableDates.map((date, index) => (
                    <input
                        key={index}
                        type="date"
                        name={`availableDate-${index}`}
                        value={date}
                        onChange={(e) => {
                            const newDates = [...newItinerary.availableDates];
                            newDates[index] = e.target.value;
                            setNewItinerary({ ...newItinerary, availableDates: newDates });
                        }}
                    />
                ))}
                <button onClick={handleAddAvailableDate}>Add Date</button>
            </div>

            {/* Available Times */}
            <div className="itinerary-times">
                <h3>Available Times</h3>
                {newItinerary.availableTimes.map((time, index) => (
                    <input
                        key={index}
                        type="time"
                        name={`availableTime-${index}`}
                        value={time}
                        onChange={(e) => {
                            const newTimes = [...newItinerary.availableTimes];
                            newTimes[index] = e.target.value;
                            setNewItinerary({ ...newItinerary, availableTimes: newTimes });
                        }}
                    />
                ))}
                <button onClick={handleAddAvailableTime}>Add Time</button>
            </div>

            <input
                type="checkbox"
                name="accessibility"
                checked={newItinerary.accessibility}
                onChange={(e) => setNewItinerary({ ...newItinerary, accessibility: e.target.checked })}
            />
            Accessible

            <button className="save-button" onClick={handleSaveClick}>Save</button>
            <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
    );
};

export default CreateItineraryForm;
