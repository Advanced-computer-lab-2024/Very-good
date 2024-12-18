import React from 'react';
import { useLocation } from 'react-router-dom';
import './Ticket.css'; // Ensure you import the CSS file
import styles from '../styles/TouristPage.module.css'; // Import CSS Module
import { useNavigate } from 'react-router-dom';
const Ticket = () => {
  const { state } = useLocation();
  const { offer, formData } = state;

  // Accessing the itinerary details
  const flightItinerary = offer.itineraries[0]; // Assuming the first itinerary
  const segments = flightItinerary.segments;
  const departureSegment = segments[0]; // First segment for departure
  const arrivalSegment = segments[segments.length - 1]; // Last segment for arrival
  const navigate = useNavigate();
  // Price details
  const totalPrice = offer.price.grandTotal;
  const currency = offer.price.currency;

  return (
    <div>
            <button onClick={() => navigate('/tourist')}>Back to Home</button> 
    <div className={styles['category-buttons']}>

      <div className="ticket-header">
        <h2 className="ticket-title">Booking Confirmed!</h2>
      </div>
      <h3 className="ticket-subtitle">Your Ticket:</h3>
      <p className="ticket-info"><strong>Name:</strong> {formData.name}</p>
      <p className="ticket-info"><strong>Email:</strong> {formData.email}</p>
      <p className="ticket-info"><strong>Passport Number:</strong> {formData.passportNumber}</p>
      <p className="ticket-info"><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
      <p className="ticket-info"><strong>Nationality:</strong> {formData.nationality}</p>
      <p className="ticket-info"><strong>Phone Number:</strong> {formData.phoneNumber}</p>
      <p className="ticket-info"><strong>Travel Date:</strong> {formData.travelDate}</p>
      {formData.returnDate && (
        <p className="ticket-info"><strong>Return Date:</strong> {formData.returnDate}</p>
      )}
      <p className="ticket-info"><strong>Checked Bags:</strong> {formData.checkedBags}</p>
      <p className="ticket-info"><strong>Seat Preference:</strong> {formData.seatPreference}</p>
      
      {/* Display flight offer details */}
      <div className="ticket-segment">
        <p className="ticket-info"><strong>Flight ID:</strong> {offer.id}</p>
        <p className="ticket-info"><strong>Departure:</strong> {departureSegment.departure.iataCode} - {departureSegment.departure.at}</p>
        <p className="ticket-info"><strong>Arrival:</strong> {arrivalSegment.arrival.iataCode} - {arrivalSegment.arrival.at}</p>
      </div>
      
      {/* Price section */}
      <div className="ticket-price">
        <p className="ticket-info"><strong>Total Price:</strong> {totalPrice} {currency}</p>
      </div>

      {/* Footer with confirmation message */}
      <div className="ticket-footer">
        <p>Thank you for booking with us!</p>
      </div>
    </div>
    </div>
  );
};

export default Ticket;
