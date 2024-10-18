import React, { useEffect, useState } from 'react';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchItinerariesNoId } from '../Services/itineraryServices';

const ActivityItinerarySort = () => {
    const [activities, setActivities] = useState([]); 
    const [activities2, setActivities2] = useState([]); 
    const [itineraries, setItineraries] = useState([]); 
    const [itineraries2, setItineraries2] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);  // Loading for activities2
    const [loadingItineraries, setLoadingItineraries] = useState(true);  // Loading for itineraries
    const [loadingItineraries2, setLoadingItineraries2] = useState(true);  // Loading for itineraries2
    const [error, setError] = useState(null);
    const [error2, setError2] = useState(null);  // Error handling for activities2
    const [errorItineraries, setErrorItineraries] = useState(null);  // Error handling for itineraries
    const [errorItineraries2, setErrorItineraries2] = useState(null);  // Error handling for itineraries2
    const [showMappings, setShowMappings] = useState(false);  // Toggle for activities1
    const [showMappings2, setShowMappings2] = useState(false);  // Toggle for activities2
    const [showItineraries, setShowItineraries] = useState(false);  // Toggle for itineraries1
    const [showItineraries2, setShowItineraries2] = useState(false);  // Toggle for itineraries2
    const [currency, setCurrency] = useState('EGP'); // Default currency

const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
};

const currencyRates = {
    EGP: 1,    // Base currency
    USD: 0.032, // Example conversion rate
    EUR: 0.029, // Example conversion rate
    // Add more rates as needed
};

const convertPrice = (price) => {
    return (price * currencyRates[currency]).toFixed(2); // Convert and format price
};

    useEffect(() => {
        const getActivities = async () => {
            try {
                const Activities1 = await fetchActivitiesDate();
                console.log("raw fetch1:", Activities1);

                if (Activities1 && Activities1.data) {
                    const sortedActivities1 = Activities1.data.sort((a, b) => {
                        const priceA = a.price;
                        const priceB = b.price;
                        return priceA - priceB;  // Sort by price in ascending order
                    });
                    setActivities(sortedActivities1);  // Update state with sorted activities
                    console.log('sorted list by price:', sortedActivities1);
                } else {
                    throw new Error("No data found in the response for activities sorted by price.");
                }
            } catch (err) {
                console.error("Error fetching activities sorted by price:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);  // Stop loading for activities1
            }
        };

        const getActivities2 = async () => {
            try {
                const Activities2 = await fetchActivitiesDate(); 
                console.log("raw fetch2:", Activities2);

                if (Activities2 && Activities2.data) {
                    const sortedActivities2 = Activities2.data.sort((a, b) => {
                        const rateA = a.ratings;
                        const rateB = b.ratings;
                        return rateB - rateA;  // Sort by ratings in descending order
                    });
                    setActivities2(sortedActivities2);  // Update state with sorted activities2
                    console.log('sorted list by ratings:', sortedActivities2);
                } else {
                    throw new Error("No data found in the response for activities sorted by ratings.");
                }
            } catch (err) {
                console.error("Error fetching activities sorted by ratings:", err.message);
                setError2(err.message);  // Set error for activities2
            } finally {
                setLoading2(false);  // Stop loading for activities2
            }
        };

        const getItineraries = async () => {
            try {
                const it1 = await fetchItinerariesNoId();
                console.log("raw fetch1:", it1);
        
                if (it1 && it1.data) {
                    // Filter out flagged itineraries
                    const filteredItineraries = it1.data.filter(itinerary => !itinerary.flagged);
                    
                    // Sort remaining itineraries by price in ascending order
                    const sortedIt1 = filteredItineraries.sort((a, b) => {
                        const priceA = a.price;
                        const priceB = b.price;
                        return priceA - priceB;  
                    });
        
                    setItineraries(sortedIt1);  // Update state with sorted itineraries
                    console.log('sorted itineraries by price:', sortedIt1);
                } else {
                    throw new Error("No data found in the response for itineraries sorted by price.");
                }
            } catch (err) {
                console.error("Error fetching itineraries sorted by price:", err.message);
                setErrorItineraries(err.message);
            } finally {
                setLoadingItineraries(false);  // Stop loading for itineraries
            }
        };
        

        const getItineraries2 = async () => {
            try {
                const it2 = await fetchItinerariesNoId();
                console.log("raw fetch2:", it2);
        
                if (it2 && it2.data) {
                    // Filter out flagged itineraries
                    const filteredItineraries = it2.data.filter(itinerary => !itinerary.flagged);
                    
                    // Sort remaining itineraries by ratings in ascending order
                    const sortedIt2 = filteredItineraries.sort((a, b) => {
                        const rateA = a.ratings;
                        const rateB = b.ratings;
                        return rateA - rateB;  
                    });
        
                    setItineraries2(sortedIt2);  // Update state with sorted itineraries2
                    console.log('sorted itineraries by ratings:', sortedIt2);
                } else {
                    throw new Error("No data found in the response for itineraries sorted by ratings.");
                }
            } catch (err) {
                console.error("Error fetching itineraries sorted by ratings:", err.message);
                setErrorItineraries2(err.message);
            } finally {
                setLoadingItineraries2(false);  // Stop loading for itineraries2
            }
        };
        

        getActivities();  // Fetch first set of activities (sorted by price)
        getActivities2();  // Fetch second set of activities (sorted by ratings)
        getItineraries();  // Fetch first set of itineraries (sorted by price)
        getItineraries2();  // Fetch second set of itineraries (sorted by start date)
    }, []);

    // Toggle functions
    const toggleMappings = () => setShowMappings(prevState => !prevState);
    const toggleMappings2 = () => setShowMappings2(prevState => !prevState);
    const toggleItineraries = () => setShowItineraries(prevState => !prevState);
    const toggleItineraries2 = () => setShowItineraries2(prevState => !prevState);
    const ItineraryCard = ({ itinerary }) => {
        return (
            <div className="itinerary-card">
                <h3>{itinerary.title}</h3>
                <p>{itinerary.description}</p>
                <p><strong>Language:</strong> {itinerary.language}</p>
                <p><strong>Price:</strong> {convertPrice(itinerary.price)} {currency}</p>
                <p><strong>Rating:</strong> {itinerary.ratings}</p>
    
                <div>
                    <strong>Locations to Visit:</strong>
                    {itinerary.locationsToVisit?.length > 0 ? (
                        itinerary.locationsToVisit.map(location => (
                            <div key={location._id}>
                                <p><strong>Location Name:</strong> {location.name}</p>
                                <p><strong>Address:</strong> {location.address}</p>
                            </div>
                        ))
                    ) : (
                        <p>No locations to visit listed.</p>
                    )}
                </div>
    
                <div>
                    <strong>Available Dates:</strong>
                    {itinerary.availableDates?.length > 0 ? (
                        itinerary.availableDates.map(date => (
                            <p key={date}>{new Date(date).toLocaleDateString()}</p>
                        ))
                    ) : (
                        <p>No available dates listed.</p>
                    )}
                </div>
    
                <div>
                    <strong>Available Times:</strong>
                    {itinerary.availableTimes?.length > 0 ? (
                        itinerary.availableTimes.map(time => (
                            <p key={time}>{time}</p>
                        ))
                    ) : (
                        <p>No available times listed.</p>
                    )}
                </div>
    
                <p><strong>Accessibility:</strong> {itinerary.accessibility ? "Yes" : "No"}</p>
                <p><strong>Pick-up Location:</strong> {itinerary.pickUpLocation}</p>
                <p><strong>Drop-off Location:</strong> {itinerary.dropOffLocation}</p>
    
                <div>
                    <strong>Tour Guide Information:</strong>
                    <p><strong>Name:</strong> {itinerary.tourGuideId?.name}</p>
                    <p><strong>Email:</strong> {itinerary.tourGuideId?.email}</p>
                    {/* <p><strong>Years of Experience:</strong> {itinerary.tourGuideId?.yearsOfExperience}</p>
                    <p><strong>Previous Job:</strong> {itinerary.tourGuideId?.previousJob}</p> */}
                </div>
            </div>
        );
    };
    
    return (
        <div className="container">
<h1>Sort Activities and Itineraries</h1>
<label>
    Choose Currency:
    <select value={currency} onChange={handleCurrencyChange}>
        <option value="EGP">EGP</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        {/* Add more currencies as needed */}
    </select>
</label>
            <h2>Activities Sorted by Price</h2>
            {/* First Toggle Button: Sort by Activity Price */}
            <button onClick={toggleMappings}>
                {showMappings ? "Hide Activities Sorted by Price" : "Show Activities Sorted by Price"}
            </button>

            {loading && <p>Loading activities sorted by price...</p>}
            {error && <p>Error: {error}</p>}

            {showMappings && (
                <>
                    <h2>Activities Sorted by Price</h2>
                    {activities.length === 0 ? (
                        <p>No activities available sorted by price.</p>
                    ) : (
                        activities.map(activity => (
                            <div key={activity._id} className="activity-card">
                                <h3>{activity.name}</h3>
                                <p>{activity.description}</p>
                                <p>Date: {activity.date}</p>
                                <p>Ticket Price: {convertPrice(activity.price)} {currency}</p>
                                </div>
                        ))
                    )}
                </>
            )}

            {/* Second Toggle Button: Sort by Activity Ratings */}
            <button onClick={toggleMappings2}>
                {showMappings2 ? "Hide Activities Sorted by Ratings" : "Show Activities Sorted by Ratings"}
            </button><br></br><br></br>

            {loading2 && <p>Loading activities sorted by ratings...</p>}
            {error2 && <p>Error: {error2}</p>}

            {showMappings2 && (
                <>
                    <h2>Activities Sorted by Ratings</h2>
                    {activities2.length === 0 ? (
                        <p>No activities available sorted by ratings.</p>
                    ) : (
                        activities2.map(activity => (
                            <div key={activity._id} className="activity-card">
                                <h3>{activity.name}</h3>
                                <p>{activity.description}</p>
                                <p>Date: {activity.date}</p>
                                <p>Ratings: {activity.ratings}</p>
                            </div>
                        ))
                    )}
                </>
            )}
             <h2>Itineraries Sorted </h2>
            {/* Third Toggle Button: Sort Itineraries by Price */}
            <button onClick={toggleItineraries}>
                {showItineraries ? "Hide Itineraries Sorted by Price" : "Show Itineraries Sorted by Price"}
            </button>

            {loadingItineraries && <p>Loading itineraries sorted by price...</p>}
            {errorItineraries && <p>Error: {errorItineraries}</p>}

            {showItineraries && (
                <>
                    <h2>Itineraries Sorted by Price</h2>
                    {itineraries.length === 0  ? (
                        <p>No itineraries available sorted by price.</p>
                    ) : (
                        itineraries.map(itinerary => (
                            <ItineraryCard key={itinerary._id} itinerary={itinerary} />)
                    ))}
                </>
            )}

            {/* Fourth Toggle Button: Sort Itineraries by Start Date */}
            <button onClick={toggleItineraries2}>
                {showItineraries2 ? "Hide Itineraries Sorted Rate" : "Show Itineraries Sorted by Rate"}
            </button><br></br><br></br>

            {loadingItineraries2 && <p>Loading itineraries sorted by start date...</p>}
            {errorItineraries2 && <p>Error: {errorItineraries2}</p>}

            {showItineraries2 && (
                <>
                    <h2>Itineraries Sorted by Rate</h2>
                    {itineraries2.length === 0 ? (
                        <p>No itineraries available sorted by start date.</p>
                    ) : (
                        itineraries2.map(itinerary => (
                            <ItineraryCard key={itinerary._id} itinerary={itinerary} />)
                    ))}
                </>
            )}
        </div>
    );
};

export default ActivityItinerarySort;