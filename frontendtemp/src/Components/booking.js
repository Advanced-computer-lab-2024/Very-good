import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';
import {makePayment2} from '../Services/payementServices'
const Booking = ({ touristId, wallet }) => {
    //touristId = touristId.touristId
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState('');
    const [selectedItinerary, setSelectedItinerary] = useState('');
    const [numberOfParticipants, setNumberOfParticipants] = useState(1);
    const [message, setMessage] = useState('');
    const [bookings, setBookings] = useState([]);
    const [selectedItineraryDate, setSelectedItineraryDate] = useState('');
    const [selectedItineraryTime, setSelectedItineraryTime] = useState('');
    const[itin, setItin] = useState(null);
    const[activ, setActiv] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activitiesResponse = await fetchActivitiesDate();
                const itinerariesResponse = await fetchItinerariesNoId();
                const currentDate = new Date();
    
                // Filter activities to only include upcoming ones
                const upcomingActivities = activitiesResponse.data.filter(activity => {
                    const activityDate = new Date(activity.date);
                    return activityDate >= currentDate;
                });
                console.log("ablha: ", itinerariesResponse.data)
    
                // Filter itineraries to only include upcoming, active, appropriate, and unflagged ones
                const upcomingItineraries = itinerariesResponse.data.filter(itinerary => {
                    const hasUpcomingDate = itinerary.availableDates.some(date => new Date(date) >= currentDate);
                    return hasUpcomingDate && itinerary.isActive && !itinerary.flagged;
                });

                console.log("b3dha: ", upcomingItineraries)



                setActivities(upcomingActivities);
                setItineraries(upcomingItineraries);
            } catch (error) {
                console.error('Error fetching activities or itineraries:', error);
                setMessage('Failed to load activities or itineraries.');
            }
        };
        
        fetchData();
    }, []);


    const fetchBookings = async () => {
        try {
            console.log("touristId in fetch booking : ", touristId)
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
            setItin(selectedItineraryData);
            console.log("selectedItineraryData :",selectedItineraryData)
            console.log("itin :",itin)
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
        
        let data;

        if (selectedItinerary) {
            bookingData.itineraryId = selectedItinerary;
            data = itin;
        }
        if (selectedActivity) {
            bookingData.activityId = selectedActivity;
            data = activ;
        }

        try {
            console.log("wallet : ", wallet);
            console.log("data.price : ", data.price)
            if(wallet < data.price){
                alert("elly m3hosh mylzmosh");
                return;
            }
            wallet -= data.price;
            console.log("touristId : ", touristId)
            const response = await axios.post('http://localhost:4000/api/bookings/', bookingData);
            setMessage(response.data.message);
            const bookingsResponse = await fetchBookings(touristId, data.price);
            await makePayment2(touristId,data.price)
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
                    <label htmlFor="activities">Select Activity:</label>
                    <select
                        id="activities"
                        value={selectedActivity}
                        onChange={(e) => {
                            setSelectedActivity(e.target.value);
                            const selectedActivityData = activities.find(activity => activity._id === e.target.value);
                            setActiv(selectedActivityData);
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
