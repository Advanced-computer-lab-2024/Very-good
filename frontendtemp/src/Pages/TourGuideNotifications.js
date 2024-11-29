import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = ({ targetId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    // Define the Axios function
    const fetchNotifications = async () => {
      try {
        // Backend API endpoint with targetId from props
        const response = await axios.get(
          `http://localhost:4000/api/notifications/TourGuide/${targetId}`
        );

        if (response.data.success) {
          setNotifications(response.data.notifications);
        } else {
          setError("Failed to fetch notifications");
        }
      } catch (err) {
        setError("An error occurred while fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    if (targetId) {
      fetchNotifications(); // Fetch notifications only if targetId is available
    }
  }, [targetId]); // Run the effect whenever the targetId changes

  // Loading and Error Handling
  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Render the notifications list
  return (
    <div>
      <h1>Notifications</h1>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}>
              <h2>{notification.subject}</h2>
              <p>{notification.message}</p>
              <small>
                Created At: {new Date(notification.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications found.</p>
      )}
    </div>
  );
};

export default Notifications;
