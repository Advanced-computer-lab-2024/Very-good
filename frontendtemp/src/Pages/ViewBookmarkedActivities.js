import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ActivityDisplayFilterWise from '../Components/ActivityDisplayFilterWise';

const ViewBookmarkedActivities = () => {
  const location = useLocation();
  const { email } = location.state;
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarkedActivities = async () => {
      try {
        const response = await axios.post('http://localhost:4000/api/tourists/getBookmarkedActivities', { email });
        setBookmarkedActivities(response.data.bookmarkedActivities);
      } catch (error) {
        setError('Error fetching bookmarked activities');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedActivities();
  }, [email]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Bookmarked Activities</h2>
      {bookmarkedActivities.length > 0 ? (
        <div className="activities-list">
          {bookmarkedActivities.map((activity) => (
            <ActivityDisplayFilterWise key={activity._id} activity={activity} email={email} />
          ))}
        </div>
      ) : (
        <p>No bookmarked activities found.</p>
      )}
    </div>
  );
};

export default ViewBookmarkedActivities;