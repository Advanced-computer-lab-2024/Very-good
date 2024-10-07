import React, { useEffect, useState } from 'react';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchMuseums } from '../Services/museumServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';

const ActivityHistoricalList = () => {
    const [activities, setActivities] = useState([]); 
    const [historicalPlaces, setHistoricalPlaces] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMappings, setShowMappings] = useState(false);
    const [itineraries, setItineraries] = useState([]);  // Note the lowercase 'itineraries'

    useEffect(() => {
        const getActivities = async () => {
            try {
                const currentDate = new Date();
                const upcomingActivities = await fetchActivitiesDate();

                const filteredActivities = upcomingActivities.data.filter(activity => {
                    const activityDate = new Date(activity.date);
                    return activityDate >= currentDate; 
                });

                if (filteredActivities.length > 0) {
                    setActivities(filteredActivities);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const getUpcomingItineraries = async () => {
            try {
                const currentDate = new Date();
                const itinerariesResponse = await fetchItinerariesNoId();

                const filteredItineraries = itinerariesResponse.data.filter(itinerary => {
                    return itinerary.availableDates.some(date => new Date(date) > currentDate);
                });

                if (filteredItineraries.length > 0) {
                    setItineraries(filteredItineraries);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const getHistoricalPlaces = async () => {
            try {
                const museumResponse = await fetchMuseums();
                setHistoricalPlaces(museumResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getActivities();
        getHistoricalPlaces();
        getUpcomingItineraries();
    }, []);

    const toggleMappings = () => {
        setShowMappings(prevState => !prevState);
    };

    return (
        <div className="container">
            <h1>Upcoming Activities, Historical Places, and Itineraries</h1>

            <button onClick={toggleMappings}>
                {showMappings ? "Hide Available to Visit" : "Show Available to Visit"}
            </button>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {showMappings && (
                <>
                    {/* Display upcoming activities */}
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
                                <p>Available for Booking: {activity.bookingOpen ? 'Yes': 'No'}</p>
                            </div>
                        ))
                    )}

                    {/* Display upcoming itineraries */}
                    <h2>Upcoming Itineraries</h2>
                    {itineraries.length === 0 ? (
                        <p>No upcoming itineraries available.</p>
                    ) : (
                        itineraries.map(itinerary => (
                            <div key={itinerary._id} className="itinerary-card">
                                <h3>{itinerary.title}</h3>
                                <p>{itinerary.description}</p>
                                <p>Price: {itinerary.price} USD</p>
                                <p>Language: {itinerary.language}</p>
                                <p>Pick-Up Location: {itinerary.pickUpLocation}</p>
                                <p>Drop-Off Location: {itinerary.dropOffLocation}</p>
                                <p>Available Dates: {itinerary.availableDates.join(', ')}</p>
                                <p>Accessibility: {itinerary.accessibility ? "Yes" : "No"}</p>
                                <p>Tags: {itinerary.tags.join(', ')}</p>
                            </div>
                        ))
                    )}

                    {/* Display historical places / museums */}
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
