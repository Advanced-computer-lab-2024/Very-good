import React, { useEffect, useState } from 'react';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchMuseums } from '../Services/museumServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';
import ActivityDisplayFilterWise from './ActivityDisplayFilterWise';
import ItineraryDisplayFilterWise from './ItineraryDisplayFilterWise';
import MuseumDisplayFilterWise from './MuseumDisplayFilterWise';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/TouristPage.module.css'; // Import CSS Module
import { useNavigate} from 'react-router-dom';

const ActivityHistoricalList = () => {
    const location = useLocation();
    console.log("state : ", location.state);
    const {email} = location.state;
    //console.log("email : ", email);
    const [activities, setActivities] = useState([]);
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMappings, setShowMappings] = useState(false);
    const [showMappingsNotUpcoming, setShowMappingsNotUpcoming] = useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [allItineraries, setAllItineraries] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [upcomingActivitiesPaidfor, setUpcomingActivitiesPaidfor] = useState([]);
    const [upcomingItinerariesPaidfor, setUpcomingItinerariesPaidfor] = useState([]);
    const [pastActivitiesPaidfor, setPastActivitiesPaidfor] = useState([]);
    const [pastItinerariesPaidfor, setPastItinerariesPaidfor] = useState([]);
    const [showUpcomingActivitiesPaidFor, setShowUpcomingActivitiesPaidFor] = useState(false);
    const [showPastActivitiesPaidFor, setShowPastActivitiesPaidFor] = useState(false);
    const [showUpcomingItinerariesPaidFor, setShowUpcomingItinerariesPaidFor] = useState(false);
    const [showPastItinerariesPaidFor, setShowPastItinerariesPaidFor] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const getActivities = async () => {
            try {
                const currentDate = new Date();
                const upcomingActivities = await fetchActivitiesDate();

                setAllActivities(upcomingActivities.data)

                const filteredActivities = upcomingActivities.data.filter(activity => {
                    const activityDate = new Date(activity.date);
                    return activityDate >= currentDate;
                });

                if (filteredActivities.length > 0) {
                    setActivities(filteredActivities);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const getUpcomingItineraries = async () => {
            try {
                const currentDate = new Date();
                const itinerariesResponse = await fetchItinerariesNoId();
                console.log("Itineraries Response:", itinerariesResponse); // Log response

                setAllItineraries(itinerariesResponse.data);
                
                const filteredItineraries = itinerariesResponse.data.filter(itinerary => {
                    return itinerary.availableDates.some(date => new Date(date) > currentDate) && !itinerary.flagged && itinerary.isActive;
                });

                if (filteredItineraries.length > 0) {
                    setItineraries(filteredItineraries);
                    console.log("Filtered Itineraries:", filteredItineraries); // Log filtered itineraries
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const getHistoricalPlaces = async () => {
            try {
                const museumResponse = await fetchMuseums();
                setHistoricalPlaces(museumResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getActivities();
        getHistoricalPlaces();
        getUpcomingItineraries();
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

    const fetchUpcomingActivitiesPaidFor = async () => {
        const activities = await fetchPaidActivities();
        const currentDate = new Date();
        const filteredActivities = activities.filter(activity => new Date(activity.date) >= currentDate);
        setUpcomingActivitiesPaidfor(filteredActivities);
    };

    const fetchPastActivitiesPaidFor = async () => {
        const activities = await fetchPaidActivities();
        const currentDate = new Date();
        const filteredActivities = activities.filter(activity => new Date(activity.date) < currentDate);
        setPastActivitiesPaidfor(filteredActivities);
    };

    const fetchUpcomingItinerariesPaidFor = async () => {
        const itineraries = await fetchPaidItineraries();
        const currentDate = new Date();
        const filteredItineraries = itineraries.filter(itinerary => itinerary.availableDates.some(date => new Date(date) >= currentDate));
        setUpcomingItinerariesPaidfor(filteredItineraries);
    };

    const fetchPastItinerariesPaidFor = async () => {
        const itineraries = await fetchPaidItineraries();
        const currentDate = new Date();
        const filteredItineraries = itineraries.filter(itinerary => itinerary.availableDates.some(date => new Date(date) < currentDate));
        setPastItinerariesPaidfor(filteredItineraries);
    };

    const toggleMappings = () => {
        setShowMappings(prevState => !prevState);
    };

    const toggleMappings2 = () => {
        setShowMappingsNotUpcoming(prevState => !prevState);
    };

    const toggleUpcomingActivitiesPaidFor = async () => {
        if (!showUpcomingActivitiesPaidFor) {
            await fetchUpcomingActivitiesPaidFor();
        }
        setShowUpcomingActivitiesPaidFor(prevState => !prevState);
    };

    const togglePastActivitiesPaidFor = async () => {
        if (!showPastActivitiesPaidFor) {
            await fetchPastActivitiesPaidFor();
        }
        setShowPastActivitiesPaidFor(prevState => !prevState);
    };

    const toggleUpcomingItinerariesPaidFor = async () => {
        if (!showUpcomingItinerariesPaidFor) {
            await fetchUpcomingItinerariesPaidFor();
        }
        setShowUpcomingItinerariesPaidFor(prevState => !prevState);
    };

    const togglePastItinerariesPaidFor = async () => {
        if (!showPastItinerariesPaidFor) {
            await fetchPastItinerariesPaidFor();
        }
        setShowPastItinerariesPaidFor(prevState => !prevState);
    };

    return (
        <div className="container">
            <div className={styles['category-buttons']}>
            <h1>All Activities, Historical Places, and Itineraries</h1>
            
            <button onClick={toggleMappings2} className={styles.button} >
                {showMappingsNotUpcoming ? "Hide All" : "Show All"}
            </button>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {showMappingsNotUpcoming && (
                <>
                    {/* Display upcoming activities */}
                    <h2>All Activities</h2>
                    {allActivities.length === 0 ? (
                        <p>No activities found.</p>
                    ) : (
                        allActivities.map(activity => (
                            <ActivityDisplayFilterWise activity={activity} comments={true} email={email} />
                        ))
                    )}

                    {/* Display upcoming itineraries */}
                    <h2>All Itineraries</h2>
                    {allItineraries.length === 0 ? (
                        <p>No itineraries found.</p>
                    ) : (
                        allItineraries.map(itinerary => (
                            <ItineraryDisplayFilterWise itinerary={itinerary} comments={true} />
                        ))
                    )}

                    {/* Display historical places / museums */}
                    <h2>Historical Places / Museums</h2>
                    {historicalPlaces.length === 0 ? (
                        <p>No historical places or museums available.</p>
                    ) : (
                        historicalPlaces.map(place => (
                            <MuseumDisplayFilterWise museum={place} />
                        ))
                    )}
                </>
            )} </div>
<div className={styles['category-buttons']}>
            <h1>Upcoming Activities, Historical Places, and Itineraries</h1>
            
            <button onClick={toggleMappings} className={styles.button} >
                {showMappings ? "Hide Available to Visit" : "Show Available to Visit"}
            </button>

            {showMappings && (
                <>
                    {/* Display upcoming activities */}
                    <h2>Activities</h2>
                    {activities.length === 0 ? (
                        <p>No activities available for the selected date.</p>
                    ) : (
                        activities.map(activity => (
                            <ActivityDisplayFilterWise activity={activity} email={email} />
                        ))
                    )}

                    {/* Display upcoming itineraries */}
                    <h2>Upcoming Itineraries</h2>
                    {itineraries.length === 0 ? (
                        <p>No upcoming itineraries available.</p>
                    ) : (
                        itineraries.map(itinerary => (
                            <ItineraryDisplayFilterWise itinerary={itinerary} />
                        ))
                    )}

                    {/* Display historical places / museums */}
                    <h2>Historical Places / Museums</h2>
                    {historicalPlaces.length === 0 ? (
                        <p>No historical places or museums available.</p>
                    ) : (
                        historicalPlaces.map(place => (
                            <MuseumDisplayFilterWise museum={place} />
                        ))
                    )}
                </>
            )}
</div>
<div className={styles['category-buttons']}>
            <h1>Paid Activities and Itineraries</h1>
            <button onClick={toggleUpcomingActivitiesPaidFor} className={styles.button} >
                {showUpcomingActivitiesPaidFor ? "Hide Upcoming Activities Paid For" : "Show Upcoming Activities Paid For"}
            </button>
            <button onClick={togglePastActivitiesPaidFor} className={styles.button} >
                {showPastActivitiesPaidFor ? "Hide Past Activities Paid For" : "Show Past Activities Paid For"}
            </button>
            <button onClick={toggleUpcomingItinerariesPaidFor} className={styles.button} >
                {showUpcomingItinerariesPaidFor ? "Hide Upcoming Itineraries Paid For" : "Show Upcoming Itineraries Paid For"}
            </button>
            <button onClick={togglePastItinerariesPaidFor}className={styles.button} >
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
