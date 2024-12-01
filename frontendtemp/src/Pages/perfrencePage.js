import React from 'react';
import PreferenceChoose from '../Components/Preference'; // Adjust the path if necessary
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';


const PreferencePage = ({touristId}) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:4000/api/notifications/Tourist/${touristId}`);
                console.log('response of notification',response)
                console.log(response.data);  // Log the full response to check if notifications exist
        
                if (response.data.success && Array.isArray(response.data.notifications) && response.data.notifications.length > 0) {
                    setNotifications(response.data.notifications);  // Update state with notifications array
                    
                } else {
                    setError('No notifications available.');
                }
            } catch (err) {
                setError('Failed to load notifications');
                console.error('Error fetching notifications:', err);
            } finally {
                setLoading(false);
            }
        };
        
        

        if (touristId) {
            console.log(touristId)
            fetchNotifications();
        }
    }, [touristId]);


    if (error) {
        return <p>Error fetching notifications: {error}</p>;
    }

    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
    
            <div>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div key={notification._id} className="notification">
                            <h4>{notification.subject}</h4>
                            <p>{notification.message}</p>
                            <small>{new Date(notification.createdAt).toLocaleString()}</small>
                        </div>
                    ))
                ) : (
                    <div>No notifications available.</div>
                )}
            </div>
        </div>
    );
    
};


export default PreferencePage;
