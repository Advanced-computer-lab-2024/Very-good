import React, { useEffect, useState } from 'react';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';
import ShareComponent from './shareComponent';
import Navbar from './Navbar';

const ActivityItinerarySort = () => {
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [currency, setCurrency] = useState('EGP');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const currencyRates = {
        EGP: 1, // Base currency
        USD: 0.02,
        EUR: 0.016,
    };

    const convertPrice = (price) => {
        return (price * currencyRates[currency]).toFixed(2);
    };

    const fetchAndSortData = async (type) => {
        setLoading(true);
        setError(null);
        try {
            if (type === 'activitiesPrice' || type === 'activitiesRating') {
                const activitiesData = await fetchActivitiesDate();
                const sortedActivities =
                    type === 'activitiesPrice'
                        ? activitiesData.data.sort((a, b) => a.price - b.price)
                        : activitiesData.data.sort((a, b) => b.ratings - a.ratings);
                setActivities(sortedActivities);
            } else if (type === 'itinerariesPrice' || type === 'itinerariesRating') {
                const itinerariesData = await fetchItinerariesNoId();
                const filteredItineraries = itinerariesData.data.filter((itinerary) => !itinerary.flagged);
                const sortedItineraries =
                    type === 'itinerariesPrice'
                        ? filteredItineraries.sort((a, b) => a.price - b.price)
                        : filteredItineraries.sort((a, b) => b.ratings - a.ratings);
                setItineraries(sortedItineraries);
            }
        } catch (err) {
            setError(`Failed to fetch data for ${type}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilterType(selectedFilter);
        fetchAndSortData(selectedFilter);
    };

    const ActivityCard = ({ activity }) => (
        <div className="activity-card">
            <h2>{activity.name}</h2>
            <p>Price: {convertPrice(activity.price)} {currency}</p>
            <p>Ratings: {activity.ratings}/5</p>
            <ShareComponent type="activity" id={activity._id} />
        </div>
    );

    const ItineraryCard = ({ itinerary }) => (
        <div className="itinerary-card">
            <h2>{itinerary.title}</h2>
            <p>Price: {convertPrice(itinerary.price)} {currency}</p>
            <p>Ratings: {itinerary.ratings}/5</p>
            <ShareComponent type="itinerary" id={itinerary._id} />
        </div>
    );

    return (
        <div className="container">
            <Navbar />
            <h1>Filter Activities and Itineraries</h1>

            {/* Currency Selector */}
            <label>
                Choose Currency:
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="EGP">EGP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select>
            </label>

            {/* Filter Menu */}
            <label>
                Filter by:
                <select value={filterType} onChange={handleFilterChange}>
                    <option value="">--Select Filter--</option>
                    <option value="activitiesPrice">Show Activities Sorted by Price</option>
                    <option value="activitiesRating">Show Activities Sorted by Ratings</option>
                    <option value="itinerariesPrice">Show Itineraries Sorted by Price</option>
                    <option value="itinerariesRating">Show Itineraries Sorted by Ratings</option>
                </select>
            </label>

            {/* Loading and Error Handling */}
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {/* Display Results */}
            <div className="results">
                {filterType.startsWith('activities') &&
                    activities.map((activity) => <ActivityCard key={activity._id} activity={activity} />)}

                {filterType.startsWith('itineraries') &&
                    itineraries.map((itinerary) => <ItineraryCard key={itinerary._id} itinerary={itinerary} />)}
            </div>
        </div>
    );
};

export default ActivityItinerarySort;
