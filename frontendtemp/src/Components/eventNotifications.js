import React, { useState, useEffect } from 'react';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';
import { getTouristsByIds } from '../Services/TouristService';
import axios from 'axios';

const ActivitiesAndItineraries = ({ touristId }) => {
    const [activities, setActivities] = useState([]);  // Stores the list of activities
    const [itineraries, setItineraries] = useState([]);  // Stores the list of itineraries
    const [loading, setLoading] = useState(true);  // Indicates loading state
    const [error, setError] = useState(null);  // Stores any error messages
    const [user, setUser] = useState(null);  // Stores the tourist (user) data

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("Tourist ID:", touristId);
    
                if (!touristId) {
                    console.error('Tourist ID is null. Please provide a valid tourist ID.');
                    setError('Tourist ID is not available.');
                    return;
                }
    
                // Fetch user data for the given touristId
                const userRaw = await getTouristsByIds(touristId);
                const userData = userRaw?.data.find(user => user._id === touristId);
    
                if (!userData) {
                    console.error('No user found with the provided Tourist ID.');
                    setError('User not found.');
                    return;
                }
    
                console.log("Fetched User Data:", userData);
                setUser(userData); // Update the user state with the fetched user data
    
                // Fetch activities and itineraries
                const activitiesResponse = await fetchActivitiesDate();
                const itinerariesResponse = await fetchItinerariesNoId();
    
                console.log("Fetched Activities:", activitiesResponse.data);
                console.log("Fetched Itineraries:", itinerariesResponse.data);
    
                // Filter booked activities
                const bookedActivities = userData.bookedActivities?.length
                    ? activitiesResponse.data.filter(activity =>
                        userData.bookedActivities.includes(activity._id)
                    )
                    : [];
                setActivities(bookedActivities);
    
                // Filter booked itineraries
                const bookedItineraries = userData.bookedItineraries?.length
                    ? itinerariesResponse.data.filter(itinerary =>
                        userData.bookedItineraries.includes(itinerary._id)
                    )
                    : [];
                setItineraries(bookedItineraries);
    
                // Automatically send notifications after filtering
                await sendNotifications(bookedActivities, bookedItineraries);
            } catch (err) {
                console.error('Error in fetchData:', err);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [touristId]);
    
        const sendNotifications = async (activities, itineraries) => {
            const now = new Date();
            const withinNext20Days = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000); // 20 days from now
        
            // Send notifications for upcoming activities
            for (const activity of activities) {
                const activityDate = new Date(activity.date);
                if (!isNaN(activityDate) && activityDate >= now && activityDate <= withinNext20Days) {
                    const notificationPayload = {
                        targetType: 'Tourist',
                        recipientId: touristId,
                        subject: 'Upcoming Activity Reminder',
                        message: `You have an upcoming activity: ${activity.name} scheduled on ${activityDate.toLocaleString()}.`,
                    };
        
                    // Use the helper method to send the notification
                    await sendNotification(notificationPayload);
                }
            }
        
            // Send notifications for upcoming itineraries
            for (const itinerary of itineraries) {
                const itineraryDate = new Date(itinerary.availableDates[0]); // Use the first available date
                if (!isNaN(itineraryDate) && itineraryDate >= now && itineraryDate <= withinNext20Days) {
                    const notificationPayload = {
                        targetType: 'Tourist',
                        recipientId: touristId,
                        subject: 'Upcoming Itinerary Reminder',
                        message: `You have an upcoming itinerary: ${itinerary.title} scheduled on ${itineraryDate.toLocaleString()}.`,
                    };
        
                    // Use the helper method to send the notification
                    await sendNotification(notificationPayload);
                }
            }
        };
        

        const sendNotification = async (notificationPayload) => {
            try {
                const response = await axios.post('http://localhost:4000/api/notifications', notificationPayload);
                console.log('Notification sent:', response.data);
            } catch (err) {
                console.error('Error sending notification:', err);
            }
        };
        

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>event reminder</h2>

            <div>
                <h3>Your Activities</h3>
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity._id} className="activity">
                            <h4>{activity.name}</h4>
                            <p>Date: {new Date(activity.date).toLocaleString()}</p>
                            <p>Location: {activity.location ? activity.location.address : 'N/A'}</p>
                        </div>
                    ))
                ) : (
                    <p>No activities found.</p>
                )}
            </div>

            <div>
                <h3>Your Itineraries</h3>
                {itineraries.length > 0 ? (
                    itineraries.map((itinerary) => (
                        <div key={itinerary._id} className="itinerary">
                            <h4>{itinerary.title}</h4>
                            <p>Dates: {itinerary.availableDates.join(', ')}</p>
                            <p>Description: {itinerary.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No itineraries found.</p>
                )}
            </div>
        </div>
    );
};

export default ActivitiesAndItineraries;
