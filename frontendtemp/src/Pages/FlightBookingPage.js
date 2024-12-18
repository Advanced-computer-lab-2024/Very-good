import React, { useEffect, useState } from 'react';
import { fetchFlightoffers, createFlightOffer, addFlightOfferToTourist } from '../Services/BookingFlightServices';  
import FlightSearchForm from '../Components/FlightSearchForm';
import FlightOffersDisplay from '../Components/FlightOffersDisplay';
import Navbar from '../Components/Navbar';

const FlightBookingPage = ({ onBack, touristId }) => {
    const [flightoffers, setFlightoffers] = useState([]); // Start as an empty array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookingStatus, setBookingStatus] = useState(null);

    // State to hold form values
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        originIata: '',
        destinationIata: '',
        departureDate: '',
        departureTime: '',
        travelerType: 'ADULT',
    });


    // Function to handle flight search
    const handleSearch = async () => {
        try {
            setLoading(true);
            const flightSearchData = {
                currencyCode: "USD",
                originDestinations: [
                    {
                        id: "1",
                        originLocationCode: formData.origin,
                        destinationLocationCode: formData.destination,
                        departureDateTimeRange: {
                            date: formData.departureDate,
                            time: formData.departureTime + ":00", // Append seconds
                        },
                    },
                ],
                travelers: [
                    {
                        id: "1",
                        travelerType: formData.travelerType,
                    },
                ],
                sources: ["GDS"],
            };
            const offers = await fetchFlightoffers(flightSearchData);

            // Check if offers is defined and has the expected structure
            if (offers) {
                setFlightoffers(offers.data); // Set flight offers directly
            } else {
                setFlightoffers([]); // Reset to empty array if offers are not valid
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const onBookFlight = async (offer) => {
        console.log("el offer aho",offer);
        const newOffer = await createFlightOffer(offer);
        const offerId = newOffer.data._id;
        await addFlightOfferToTourist(touristId, offerId);
        return offerId;
    };

    // Function to update form data from FlightSearchForm
    const updateFormData = (data) => {
        setFormData(data);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <Navbar/>
            <h1>Flight Booking</h1>
            <FlightSearchForm onSearch={handleSearch} formData={formData} updateFormData={updateFormData} />
            <h2>Flight Offers</h2>
            <button onClick={onBack}>Back</button>
            {console.log("homa dol :",flightoffers)}
            {bookingStatus && <p>{bookingStatus}</p>}
            {flightoffers.length > 0 ? (
                <FlightOffersDisplay flightOffers={flightoffers} onBookFlight={onBookFlight}/>
            ) : (
                <p>No flight offers available. Please try a different search.</p>
            )}
        </div>
    );
};

export default FlightBookingPage;
