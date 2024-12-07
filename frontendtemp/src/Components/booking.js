import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';
import { makePayment2 } from '../Services/payementServices';
import ItineraryDisplayFilterWise from './ItineraryDisplayFilterWise';
import ActivityDisplayFilterWise from './ActivityDisplayFilterWise';
import PaymentForm from './PaymentForm'; // Import the PaymentForm component
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QP6GEIjdL7iHsR6Zjy5EB8ixOlCfL2PnqICOkaAorgK8zFYvpnsDeHCZSx78V0uBCIaZ8uvdtVbw2FYPCbKxWMx00qSClGNRP'); // Replace with your Stripe publishable key

const Booking = ({ touristId, wallet }) => {
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState('');
    const [selectedItinerary, setSelectedItinerary] = useState('');
    const [numberOfParticipants, setNumberOfParticipants] = useState(1);
    const [message, setMessage] = useState('');
    const [bookings, setBookings] = useState([]);
    const [selectedItineraryDate, setSelectedItineraryDate] = useState('');
    const [selectedItineraryTime, setSelectedItineraryTime] = useState('');
    const [itin, setItin] = useState(null);
    const [activ, setActiv] = useState(null);
    const [data, setData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [showPaymentForm, setShowPaymentForm] = useState(false); // Add state to control payment form visibility
    const [clientSecret, setClientSecret] = useState(''); // Add state for clientSecret
    const [promoCode, setPromoCode] = useState(''); // State for selected promo code
    const [promoCodes, setPromoCodes] = useState([]); // State for list of promo codes
    const [promoCodePercentage, setPromoCodePercentage] = useState(0); // State for selected promo code percentage

    const calculateDiscountedPrice = (price, discountPercentage) => {
        return price - (price * discountPercentage / 100);
    };

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

                // Filter itineraries to only include upcoming, active, appropriate, and unflagged ones
                const upcomingItineraries = itinerariesResponse.data.filter(itinerary => {
                    const hasUpcomingDate = itinerary.availableDates.some(date => new Date(date) >= currentDate);
                    return hasUpcomingDate && itinerary.isActive && !itinerary.flagged;
                });
                setActivities(upcomingActivities);
                setItineraries(upcomingItineraries);
            } catch (error) {
                console.error('Error fetching activities or itineraries:', error);
                setMessage('Failed to load activities or itineraries.');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchClientSecret = async () => {
            if (paymentMethod === 'creditCard' && data) {
                try {
                    const response = await axios.post('http://localhost:4000/api/payments/create-payment-intent', {
                        amount: data.price * 100, // Convert to cents (smallest currency unit)
                        currency: 'usd', // Default to USD if not provided
                    });
                    setClientSecret(response.data.clientSecret);
                } catch (error) {
                    console.error('Error creating payment intent:', error);
                    setMessage('Error creating payment intent.');
                }
            }
        };

        fetchClientSecret();
    }, [paymentMethod, data]);

    useEffect(() => {
        const fetchPromoCodes = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/promoCodes');
                return Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error('Error fetching promo codes:', error);
                return [];
            }
        };

        const fetchUserPromoCodes = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/promoCodes/${touristId}`);
                return Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error('Error fetching user promo codes:', error);
                return [];
            }
        };

        const fetchAllPromoCodes = async () => {
            const [genericPromoCodes, userPromoCodes] = await Promise.all([fetchPromoCodes(), fetchUserPromoCodes()]);
            setPromoCodes([...genericPromoCodes, ...userPromoCodes]);
        };

        if (touristId) {
            fetchAllPromoCodes();
        }
    }, [touristId]);

    const handlePromoCodeChange = (e) => {
        const selectedCode = e.target.value;
        setPromoCode(selectedCode);
        const selectedPromo = promoCodes.find(code => code.title === selectedCode);
        setPromoCodePercentage(selectedPromo ? selectedPromo.percentage : 0);
    };

    const fetchBookings = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/bookings/${touristId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        }
    };

    const handleItinerarySelection = (itineraryId) => {
        const selectedItineraryData = itineraries.find(itinerary => itinerary._id === itineraryId);
        if (selectedItineraryData) {
            setSelectedItinerary(itineraryId);
            setItin(selectedItineraryData);
            setData(selectedItineraryData);
            //setSelectedItineraryDate(selectedItineraryData.availableDates[0] || '');
            //setSelectedItineraryTime(selectedItineraryData.availableTimes[0] || '');
        }
        setSelectedActivity(''); // Clear activity selection
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedActivity && !selectedItinerary) {
            setMessage('Please select either an activity or an itinerary.');
            return;
        }

        // For now, just log the selected payment method
        console.log('Selected payment method:', paymentMethod);

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
            setData(itin);
        }
        if (selectedActivity) {
            bookingData.activityId = selectedActivity;
            data = activ;
            setData(activ);
        }

        if (!data) {
            setMessage('Error: No activity or itinerary selected.');
            return;
        }

        if (paymentMethod === 'wallet') {
            try {
                if (wallet < data.price) {
                    alert('ely m3hosh mylzmosh');
                    return;
                }

                if(!promoCode)
                    wallet -= data.price;
                else
                    wallet -= calculateDiscountedPrice(data.price, promoCodePercentage).toFixed(2);

                
                const response = await axios.post('http://localhost:4000/api/bookings/', bookingData);
                setMessage(response.data.message);
                const bookingsResponse = await fetchBookings();
                
                if(!promoCode)
                    await makePayment2(touristId, data.price);
                else
                    await makePayment2(touristId, calculateDiscountedPrice(data.price, promoCodePercentage).toFixed(2));

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
        }

        if (paymentMethod === 'creditCard') {
            const response = await axios.post('http://localhost:4000/api/bookings/', bookingData);
        }
    };

    const handlePayment = async () => {
        if (!selectedActivity && !selectedItinerary) {
            setMessage('Please select either an activity or an itinerary.');
            return;
        }

        // For now, just log the selected payment method
        console.log('Selected payment method:', paymentMethod);

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
            setData(itin);
        }
        if (selectedActivity) {
            bookingData.activityId = selectedActivity;
            data = activ;
            setData(activ);
        }

        if (!data) {
            setMessage('Error: No activity or itinerary selected.');
            return;
        }

        const response = await axios.post('http://localhost:4000/api/bookings/', bookingData);

        const bookingsResponse = await fetchBookings();
        setBookings(bookingsResponse || []);
        setSelectedActivity('');
        setSelectedItinerary('');
        setNumberOfParticipants(1);
        setSelectedItineraryDate('');
        setSelectedItineraryTime('');

    }

    const handleCancel = async (bookingId, startDateTime, refundedAmount) => {
        const currentDateTime = new Date();
        const bookingDateTime = new Date(startDateTime);
        const timeDiff = bookingDateTime.getTime() - currentDateTime.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 48) {
            alert('Booking cannot be cancelled less than 48 hours before start time.');
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:4000/api/bookings/cancel/${bookingId}`, {refundedAmount});
            setMessage(response.data.message);
            const bookingsResponse = await fetchBookings();
            setBookings(bookingsResponse || []);
            setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
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
                            setData(selectedActivityData);
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
                <div>
                    <label>Payment Method:</label>
                    <div>
                        <input
                            type="radio"
                            id="wallet"
                            name="paymentMethod"
                            value="wallet"
                            checked={paymentMethod === 'wallet'}
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                setShowPaymentForm(false); // Hide the payment form
                            }}
                        />
                        <label htmlFor="wallet">Wallet</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="creditCard"
                            name="paymentMethod"
                            value="creditCard"
                            checked={paymentMethod === 'creditCard'}
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                setShowPaymentForm(true); // Show the payment form
                            }}
                        />
                        <label htmlFor="creditCard">Credit Card</label>
                    </div>
                </div>
                <div>
                    <label htmlFor="promoCode">Promo Code:</label>
                    <select
                        id="promoCode"
                        value={promoCode}
                        onChange={handlePromoCodeChange}
                    >
                        <option value="">--Select a Promo Code--</option>
                        {promoCodes.map((code) => (
                            <option key={code._id} value={code.title}>
                                {code.title} - {code.percentage}% off
                            </option>
                        ))}
                    </select>
                </div>
                {paymentMethod === 'wallet' && (
                    <>
                        <button type="submit">Book Now</button>
                        {message && <p>{message}</p>}
                    </>
                )}
            </form>
            {showPaymentForm && clientSecret && (
                console.log("clientSecret in booking.js : ",clientSecret),
                console.log("stripePromise in booking.js : ",stripePromise),    
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    {promoCodePercentage > 0 ? (
                        <PaymentForm data={{ price: calculateDiscountedPrice(data.price, promoCodePercentage).toFixed(2), currency: 'usd' }} handlePayment={handlePayment} />
                    ) : (
                        <PaymentForm data={{ price: data.price, currency: 'usd' }} handlePayment={handlePayment} />
                    )}
                </Elements>
            )}
            {data && (
                <div>
                    <h4>{`Total Price: $${data.price}`}</h4> {/* Display total price */}
                    {promoCodePercentage > 0 && (
                        <h4>{`Discounted Price: $${calculateDiscountedPrice(data.price, promoCodePercentage).toFixed(2)}`}</h4> 
                    )}
                </div>
            )}
            <h2>Your Bookings</h2>
            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <div key={booking._id}>
                        {booking.activityId ? (
                            <ActivityDisplayFilterWise activity={booking.activityId} />
                        ) : (
                            <ItineraryDisplayFilterWise itinerary={booking.itineraryId} />
                        )}
                        <p>
                            Start Date: {(() => {
                                const upcomingDate = booking.itineraryId
                                    ? booking.itineraryId.availableDates
                                        .map(date => new Date(date))  // Convert each date to Date object
                                        .filter(date => date >= new Date())  // Filter only upcoming dates
                                        .sort((a, b) => a - b)[0]  // Sort the dates and get the first upcoming one
                                    : new Date(booking.activityId?.date); // Fallback to activity date if no itinerary
                                return new Date(upcomingDate).toLocaleString(); // Format and display the date
                            })()}
                        </p>                       
                        <p>Status: {booking.status}</p>
                        {booking.status !== 'Cancelled' && (
                            <button
                            onClick={() => {
                                const upcomingDate = booking.itineraryId
                                    ? booking.itineraryId.availableDates
                                        .map(date => new Date(date))  // Convert each date to Date object
                                        .filter(date => date >= new Date())  // Filter only upcoming dates
                                        .sort((a, b) => a - b)[0]  // Sort the dates and get the first upcoming one
                                    : null;
                        
                                handleCancel(
                                    booking._id,
                                    booking.activityId
                                        ? booking.activityId?.date
                                        : upcomingDate || '',  // If no upcoming date, send an empty string or fallback date
                                    booking.activityId?
                                    booking.activityId.price : booking.itineraryId.price
                                );
                            }}
                        >
                            Cancel Booking
                        </button>
                        )}
                    </div>
                ))
            ) : (
                <p>No bookings yet.</p>
            )}
        </div>
    );
};

export default Booking;
