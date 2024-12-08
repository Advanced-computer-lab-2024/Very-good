import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransportationDisplay from '../Components/TransportationDisplay';
import { fetchTouristByEmail } from '../RequestSendingMethods';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import styles from '../styles/TourGuidePage.module.css'; // Keep your existing global styles
const BookTransportationPage = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [touristId, setTouristId] = useState(null);
  const [transportations, setTransportations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departureLocation, setDepartureLocation] = useState('');
  const [arrivalLocation, setArrivalLocation] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const getTouristData = async () => {
      if (email) {
        const data = await fetchTouristByEmail({ email });
        if (data) {
          setTouristId(data.data._id); // Extract and store only the ID
        }
      }
    };

    getTouristData();
  }, [email]);

  const fetchTransportations = async () => {
    setLoading(true);
    try {
      //console.log("departureLocation : ", departureLocation);
      //console.log("arrivalLocation : ", arrivalLocation);
      const response = await axios.post('http://localhost:4000/api/transportations/getWithLocation', {
        departureLocation,
        arrivalLocation
      });
      setTransportations(response.data);
    } catch (err) {
      alert(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    fetchTransportations();
  };

  if (loading) {
    return <div>Loading transportations...</div>;
  }

  if (error) {
    return <div>Error fetching transportations: {error}</div>;
  }

  return (
    <div className="book-transportation-page">
      <Navbar/>
      <h1>Available Transportations</h1>
      {!formSubmitted ? (
        <form onSubmit={handleSubmit} className={styles['category-buttons']} style={{margin : '0 auto'}}>
          <div>
            <label>Departure Location:</label>
            <input
              type="text"
              value={departureLocation}
              onChange={(e) => setDepartureLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Arrival Location:</label>
            <input
              type="text"
              value={arrivalLocation}
              onChange={(e) => setArrivalLocation(e.target.value)}
              required
            />
          </div>
          <button type="submit">Search</button>
        </form>
      ) : (
        <>
          {transportations.length === 0 ? (
            <p>No transportations available at the moment.</p>
          ) : (
            transportations.map((transportation) => (
              <TransportationDisplay key={transportation._id} transportation={transportation} touristId={touristId}/>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default BookTransportationPage;
