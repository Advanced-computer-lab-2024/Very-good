import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';

const Booking = () => {
    const [touristId, setTouristId] = useState(''); // Replace with actual logged-in tourist ID
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState('');
    const [selectedItinerary, setSelectedItinerary] = useState('');
    const [numberOfParticipants, setNumberOfParticipants] = useState(1);
    const [message, setMessage] = useState('');
    const [bookings, setBookings] = useState([]);
    const [selectedItineraryDate, setSelectedItineraryDate] = useState('');
    const [selectedItineraryTime, setSelectedItineraryTime] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activitiesResponse = await fetchActivitiesDate();
                const itinerariesResponse = await fetchItinerariesNoId();
                
                 // Get only the date part
                // setItineraries(itinerariesResponse.data);
                setActivities(activitiesResponse.data);
               
                /////////////
                const currentDate = new Date()// Get only the date part

// Filter itineraries to only show those with future available dates
                const availableItineraries = itinerariesResponse.data.filter(itinerary => {
                    return itinerary.availableDates.some(date => {
                        // Normalize date string by stripping time part for comparison
                        const availableDate = new Date(date) // Only get the date part
                        return availableDate > currentDate;
                    });
                });
                setItineraries(availableItineraries);

                itineraries.forEach(element => {
                    console.log("mu date",element.availableDates)
                });
                console.log( "avalible date " ,availableItineraries);
               
                console.log("iten new ", itineraries)
                ////////////
                
            

                if (touristId) {
                    const bookingsResponse = await fetchBookings(touristId);
                    setBookings(bookingsResponse || []);
                }
            } catch (error) {
                setMessage('Failed to load activities or itineraries.');
            }
        };
    
        fetchData();
    }, [touristId]);

    const fetchBookings = async (touristId) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/bookings/${touristId}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        }
    };

    const handleItinerarySelection = (itineraryId) => {
        const selectedItineraryData = itineraries.find(itinerary => itinerary._id === itineraryId);
        if (selectedItineraryData) {
            setSelectedItinerary(itineraryId);
            setSelectedItineraryDate(selectedItineraryData.availableDates[0] || '');
            setSelectedItineraryTime(selectedItineraryData.availableTimes[0] || '');
        }
        setSelectedActivity(''); // Clear activity selection
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("itenraries",itineraries)
    
        if (!selectedActivity && !selectedItinerary) {
            setMessage('Please select either an activity or an itinerary.');
            return;
        }

        const bookingData = {
            touristId,
            numberOfParticipants,
            startDateTime: selectedActivity 
                ? new Date().toISOString() 
                : `${selectedItineraryDate}T${selectedItineraryTime}:00.000Z`,
        };
    
        if (selectedItinerary) bookingData.itineraryId = selectedItinerary;
        if (selectedActivity) bookingData.activityId = selectedActivity;
    
        try {
            const response = await axios.post('http://localhost:4000/api/bookings', bookingData);
            setMessage(response.data.message);
            const bookingsResponse = await fetchBookings(touristId);
            setBookings(bookingsResponse || []);
            setSelectedActivity('');
            setSelectedItinerary('');
            setNumberOfParticipants(1);
            setSelectedItineraryDate('');
            setSelectedItineraryTime('');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error creating booking.';
            setMessage(errorMessage);
        }
    };

    const handleCancel = async (bookingId, startDateTime) => {
        const currentDateTime = new Date();
        const bookingDateTime = new Date(startDateTime);
        const timeDiff = bookingDateTime.getTime() - currentDateTime.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 48) {
            setMessage('Booking cannot be cancelled less than 48 hours before start time.');
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:4000/api/bookings/cancel/${bookingId}`);
            setMessage(response.data.message);
            const bookingsResponse = await fetchBookings(touristId);
            setBookings(bookingsResponse || []);
        } catch (error) {
            setMessage('Error cancelling booking.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Book an Activity or Itinerary</h2>
                <div>
                    <label htmlFor="touristId">Tourist ID:</label>
                    <input
                        type="text"
                        id="touristId"
                        value={touristId}
                        onChange={(e) => setTouristId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="activities">Select Activity:</label>
                    <select
                        id="activities"
                        value={selectedActivity}
                        onChange={(e) => {
                            setSelectedActivity(e.target.value);
                            setSelectedItinerary('');
                            setSelectedItineraryDate('');
                            setSelectedItineraryTime('');
                        }}
                    >
                        <option value="">--Select an Activity--</option>
                        {activities.map((activity) => (
                            <option key={activity._id} value={activity._id}>
                                {activity.name} - ${activity.price}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="itineraries">Select Itinerary:</label>
                    <select
                        id="itineraries"
                        value={selectedItinerary}
                        onChange={(e) => handleItinerarySelection(e.target.value)}
                    >
                        <option value="">--Select an Itinerary--</option>
                        {itineraries.map((itinerary) => (
                            <option key={itinerary._id} value={itinerary._id}>
                                {itinerary.title} - ${itinerary.price}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedItinerary && selectedItineraryDate && selectedItineraryTime && (
                    <div>
                        <p>Selected Date: {selectedItineraryDate}</p>
                        <p>Selected Time: {selectedItineraryTime}</p>
                    </div>
                )}
                <div>
                    <label htmlFor="participants">Number of Participants:</label>
                    <input
                        type="number"
                        id="participants"
                        value={numberOfParticipants}
                        onChange={(e) => setNumberOfParticipants(e.target.value)}
                        min="1"
                        required
                    />
                </div>
                <button type="submit">Book Now</button>
                {message && <p>{message}</p>}
            </form>
            <h2>Your Bookings</h2>
            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <div key={booking._id}>
                        <p>{booking.activityId?.name || booking.itineraryId?.title}</p>
                        <p>Start Time: {new Date(booking.startDateTime).toLocaleString()}</p>
                        <p>Status: {booking.status}</p>
                        {booking.status !== 'Cancelled' && (
                            <button onClick={() => handleCancel(booking._id, booking.startDateTime)}>Cancel Booking</button>
                        )}
                    </div>
                ))
            ) : (
                <p>No bookings found.</p>
            )}
        </div>
    );
};

export default Booking;
