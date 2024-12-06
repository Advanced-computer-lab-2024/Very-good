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

const ActivityHistoricalList = () => {
    const location = useLocation();
    const { email } = location.state;

    const [selectedCategory, setSelectedCategory] = useState('All');
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
            <h1>Activities, Historical Places, and Itineraries</h1>
            
            <label htmlFor="categorySelect">Choose a category:</label>
            <select id="categorySelect" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="All">All Activities, Historical Places, and Itineraries</option>
                <option value="Upcoming">Upcoming Activities and Itineraries</option>
                <option value="Paid">Paid Activities and Itineraries</option>
            </select>

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

            {selectedCategory === 'Upcoming' && (
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

            {selectedCategory === 'Paid' && (
                <>
                    <h2>Upcoming Paid Activities</h2>
                    {upcomingActivitiesPaidfor.map(activity => (
                        <ActivityDisplayFilterWise key={activity.id} activity={activity} email={email} />
                    ))}
                    <h2>Upcoming Paid Itineraries</h2>
                    {upcomingItinerariesPaidfor.map(itinerary => (
                        <ItineraryDisplayFilterWise key={itinerary.id} itinerary={itinerary} />
                    ))}
                </>
            )}
        </div>
    );
};

export default ActivityHistoricalList;
