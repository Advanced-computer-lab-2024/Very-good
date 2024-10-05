import React, { useEffect, useState } from 'react';

import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchMuseums } from '../Services/museumServices';




const ActivityHistoricalList = () => {
    const [activities, setActivities] = useState([]); 
    const [historicalPlaces, setHistoricalPlaces] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMappings, setShowMappings] = useState(false);

    useEffect(() => {
        const getActivities = async (req, res) => {
            try {
                // Get the current date and time
                const currentDate = new Date();
                console.log("Current date:", currentDate);
        
                const upcomingActivities = await fetchActivitiesDate();
        
                // Collect activities that are upcoming
                const filteredActivities = upcomingActivities.data.filter(activity => {
                    const activityDate = new Date(activity.date);
                    console.log("Activity date:", activity.date);
                    console.log("Both dates:", activityDate, "and current date:", currentDate);
        
                    // Return true if the activity is upcoming
                    return activityDate >= currentDate; 
                });
        
                // Set state with only the filtered upcoming activities
                if (filteredActivities.length > 0) {
                    setActivities(filteredActivities);
                    console.log("Number of upcoming activities:", filteredActivities.length);
                } else {
                    console.log("No upcoming activities found.");
                }
            } catch (err) {
                console.error("Error fetching activities:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        const getHistoricalPlaces = async () => {
            try {
                const museumResponse = await fetchMuseums();
                console.log("raw fetch",museumResponse)
                setHistoricalPlaces(museumResponse.data);
                console.log("placesH", historicalPlaces)

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getActivities();
        getHistoricalPlaces();
    }, []);
    const toggleMappings = () => {
        setShowMappings(prevState => !prevState);  // Toggle between true and false
    };
    

    return (
        <div className="container">
            <h1>Upcoming Activities and Historical Places/Museums</h1>

            {/* Toggle button */}
            <button onClick={toggleMappings}>
                {showMappings ? "Hide Avaliable to visit" : "Show Avaliable to visit"} {/* Dynamic button text */}
            </button>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {showMappings && (
                <>
                  <h2>Activities</h2>
                    {activities.length === 0 ? (
                        <p>No activities available for the selected date.</p>
                    ) : (
                        activities.map(activity => (
                            <div key={activity._id} className="activity-card">
                                <h3>{activity.name}</h3>
                                <p>{activity.description}</p>
                                <p>Date: {activity.date}</p>
                                <p>Location: {activity.location.lat}, {activity.location.lng}</p>
                                <p>Time: {activity.time.hours} hr, {activity.time.minutes} m</p>
                                <p>Ticket Price: {activity.price} EGP</p>
                                <p>Rating: {activity.ratings}</p>
                                <p>Discounts: {activity.specialDiscount}</p>
                                <p>Avaliable for Booking: {activity.bookingOpen ? 'Yes': 'No'}</p>


                            </div>
                        ))
                    )}

                 <h2>Historical Places / Museums</h2>
                    {historicalPlaces.length === 0 ? (
                        <p>No historical places or museums available.</p>
                    ) : (
                        historicalPlaces.map(place => (
                            <div key={place._id} className="opening-hours">
                                <h3>{place.name}</h3>
                                <p>{place.description}</p>
                                <div className="pictures-container">
                                    {place.pictures.map((picture, index) => (
                                       <img key={index} src={picture} alt={`Picture of ${place.name}`} className="museum-image" />

                                    ))}
                                </div>
                                <p>Location: {place.location.city}, {place.location.country}, {place.location.address}</p>
                                <div className="hours">
                                    <p>Opening Hours:</p>
                                    {Object.keys(place.openingHours).map(day => (
                                        <p key={day}>{day}: {place.openingHours[day]}</p>
                                    ))}
                                </div>
                                <p>Ticket Prices: Foreigner - ${place.ticketPrices.foreigner}, Native - ${place.ticketPrices.native}, Student - ${place.ticketPrices.student}</p>
                                <p>Is this a museum? {place.museum ? "Yes" : "No"}</p>
                            </div>
                        ))
                    )}
                </>
            )}
        </div>
    );
};

export default ActivityHistoricalList;