import React, { useEffect, useState } from 'react';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchMuseums } from '../Services/museumServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';
import ActivityDisplayFilterWise from './ActivityDisplayFilterWise';
import ItineraryDisplayFilterWise from './ItineraryDisplayFilterWise';
import MuseumDisplayFilterWise from './MuseumDisplayFilterWise';
import { useLocation } from 'react-router-dom';
import styles from '../styles/TouristPage.module.css'; // Import CSS Module

import axios from 'axios';
import styles from '../styles/TouristPage.module.css'; // Import CSS Module
import { useNavigate} from 'react-router-dom';
const ActivityHistoricalList = () => {
    const location = useLocation();
    console.log("state : ", location.state);
    const {email} = location.state;
    //console.log("email : ", email);
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [allItineraries, setAllItineraries] = useState([]);
    const [upcomingActivitiesPaidfor, setUpcomingActivitiesPaidfor] = useState([]);
    const [upcomingItinerariesPaidfor, setUpcomingItinerariesPaidfor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentDate = new Date();

                // Fetch all activities
                const activitiesResponse = await fetchActivitiesDate();
                setAllActivities(activitiesResponse.data);
                const filteredActivities = activitiesResponse.data.filter(activity => new Date(activity.date) >= currentDate);
                setActivities(filteredActivities);

                // Fetch itineraries
                const itinerariesResponse = await fetchItinerariesNoId();
                setAllItineraries(itinerariesResponse.data);
                const filteredItineraries = itinerariesResponse.data.filter(itinerary =>
                    itinerary.availableDates.some(date => new Date(date) > currentDate)
                );
                setItineraries(filteredItineraries);

                // Fetch historical places
                const museumsResponse = await fetchMuseums();
                setHistoricalPlaces(museumsResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchPaidActivities = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/tourists/${email}/activities`);
            return response.data.activities;
        } catch (error) {
            console.error('Error fetching paid activities:', error);
            setError(error.message);
        }
    };

    const fetchPaidItineraries = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/tourists/${email}/itineraries`);
            return response.data.itineraries;
        } catch (error) {
            console.error('Error fetching paid itineraries:', error);
            setError(error.message);
        }
    };

    const handleCategoryChange = async (event) => {
        setSelectedCategory(event.target.value);

        if (event.target.value === 'Paid') {
            const paidActivities = await fetchPaidActivities();
            const paidItineraries = await fetchPaidItineraries();
            const currentDate = new Date();

            const filteredUpcomingActivities = paidActivities.filter(activity => new Date(activity.date) >= currentDate);
            const filteredUpcomingItineraries = paidItineraries.filter(itinerary =>
                itinerary.availableDates.some(date => new Date(date) >= currentDate)
            );

            setUpcomingActivitiesPaidfor(filteredUpcomingActivities);
            setUpcomingItinerariesPaidfor(filteredUpcomingItineraries);
        }
    };

    return (
        <div className="container">
            <div className={styles['category-buttons']}>
            <h1>All Activities, Historical Places, and Itineraries</h1>
            
            <button onClick={toggleMappings2} className={styles.button}>
                {showMappingsNotUpcoming ? "Hide All" : "Show All"}
            </button>
        
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {selectedCategory === 'All' && (
                <>
                    <h2>All Activities</h2>
                    {allActivities.map(activity => (
                        <ActivityDisplayFilterWise key={activity.id} activity={activity} email={email} />
                    ))}
                    <h2>All Itineraries</h2>
                    {allItineraries.map(itinerary => (
                        <ItineraryDisplayFilterWise key={itinerary.id} itinerary={itinerary} />
                    ))}
                    <h2>Historical Places / Museums</h2>
                    {historicalPlaces.map(place => (
                        <MuseumDisplayFilterWise key={place.id} museum={place} />
                    ))}
                </>
            )}
     </div>
     <div className={styles['category-buttons']}>
            <h1>Upcoming Activities, Historical Places, and Itineraries</h1>
            
            <button onClick={toggleMappings} className={styles.button}>
                {showMappings ? "Hide Available to Visit" : "Show Available to Visit"}
            </button>

            {showMappings && (
                <>
                    <h2>Upcoming Activities</h2>
                    {activities.map(activity => (
                        <ActivityDisplayFilterWise key={activity.id} activity={activity} email={email} />
                    ))}
                    <h2>Upcoming Itineraries</h2>
                    {itineraries.map(itinerary => (
                        <ItineraryDisplayFilterWise key={itinerary.id} itinerary={itinerary} />
                    ))}
                </>
            )}
</div>
<div className={styles['category-buttons']}>
            <h1>Paid Activities and Itineraries</h1>
            <button onClick={toggleUpcomingActivitiesPaidFor} className={styles.button}>
                {showUpcomingActivitiesPaidFor ? "Hide Upcoming Activities Paid For" : "Show Upcoming Activities Paid For"}
            </button>
            <button onClick={togglePastActivitiesPaidFor} className={styles.button}>
                {showPastActivitiesPaidFor ? "Hide Past Activities Paid For" : "Show Past Activities Paid For"}
            </button>
            <button onClick={toggleUpcomingItinerariesPaidFor} className={styles.button}>
                {showUpcomingItinerariesPaidFor ? "Hide Upcoming Itineraries Paid For" : "Show Upcoming Itineraries Paid For"}
            </button>
            <button onClick={togglePastItinerariesPaidFor} className={styles.button}>
                {showPastItinerariesPaidFor ? "Hide Past Itineraries Paid For" : "Show Past Itineraries Paid For"}
            </button>

            {showUpcomingActivitiesPaidFor && (
                <>
                    <h2>Upcoming Activities Paid For</h2>
                    {upcomingActivitiesPaidfor.length === 0 ? (
                        <p>No upcoming activities paid for.</p>
                    ) : (
                        upcomingActivitiesPaidfor.map(activity => (
                            <ActivityDisplayFilterWise activity={activity} email={email} />
                        ))
                    )}
                </>
            )}

            {showPastActivitiesPaidFor && (
                <>
                    <h2>Past Activities Paid For</h2>
                    {pastActivitiesPaidfor.length === 0 ? (
                        <p>No past activities paid for.</p>
                    ) : (
                        pastActivitiesPaidfor.map(activity => (
                            <ActivityDisplayFilterWise activity={activity} email={email} comments={true} />
                        ))
                    )}
                </>
            )}

            {showUpcomingItinerariesPaidFor && (
                <>
                    <h2>Upcoming Itineraries Paid For</h2>
                    {upcomingItinerariesPaidfor.length === 0 ? (
                        <p>No upcoming itineraries paid for.</p>
                    ) : (
                        upcomingItinerariesPaidfor.map(itinerary => (
                            <ItineraryDisplayFilterWise itinerary={itinerary} />
                        ))
                    )}
                </>
            )}

            {showPastItinerariesPaidFor && (
                <>
                    <h2>Past Itineraries Paid For</h2>
                    {pastItinerariesPaidfor.length === 0 ? (
                        <p>No past itineraries paid for.</p>
                    ) : (
                        pastItinerariesPaidfor.map(itinerary => (
                            <ItineraryDisplayFilterWise itinerary={itinerary} comments={true} />
                        ))
                    )}
                </>
            )}
              
        </div>
        <button className={styles.button} onClick={() => navigate("/tourist")}>Back </button>
        </div>
        
    );
};

export default ActivityHistoricalList;
