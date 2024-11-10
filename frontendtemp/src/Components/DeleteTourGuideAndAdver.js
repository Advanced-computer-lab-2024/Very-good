import React, { useEffect, useState ,useRef } from 'react';
import {
    fetchActivities,
    deleteActivity
} from '../Services/activityServices';
import {
    fetchItineraries,
    deleteItinerary
} from '../Services/itineraryServices';
import {
    deletAdvertiser,
    deleteTourGuide,
    getActivitieswithAdvertiserId,
    fetchAdvertiserByEmail,
    getTourGuideByEmail
} from '../RequestSendingMethods';

const DeleteTA = ({ dataTA ,isTourGuideA }) => {
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [touristAct, setTouristAct] = useState([]);
    const [notouristAct, setNotouristAct] = useState([]);
    const [touristIten, setTouristIten] = useState([]);
    const [notouristIten, setNotouristIten] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flag, setFlag] = useState(false);
    const [flag2, setFlag2] = useState(false);
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);

            let userResponse;
            const isTourGuide = isTourGuideA;
            console.log("isTourGuide:", isTourGuide)
            // Fetch user data based on type (Tour Guide or Advertiser)
            if (isTourGuide) {
                userResponse = await getTourGuideByEmail(dataTA);
                console.log("What is based to the fetch activity 1", user?.tourGuide?._id)
                console.log("Tour guide response:", userResponse);
                setUserType('tourGuide');
            } else {
                console.log("dataTA for advertiser" , { email: dataTA })
                userResponse = await fetchAdvertiserByEmail({ email: dataTA });
                console.log("Advertiser response:", userResponse);
                setUserType('advertiser');
            }

            // Check if we received a valid response
            if (!userResponse || (!userResponse.tourGuide && !userResponse.advertiser)) {
                console.warn("No valid user data received!");
                setError("User not found or invalid response.");
                setLoading(false);
                return;
            }

            // Set user state immediately to avoid stale state issues
            setUser(userResponse);
 
            // Fetch related activities or itineraries based on user type
            if (isTourGuide) {
                console.log("What is based to the fetch activity 2", user?.tourGuide?._id)
                let str = String(user?.tourGuide?._id)
                console.log("str",str)
                const itinerariesResponse = await fetchItineraries(str);
                console.log("Full itinerariesResponse:", itinerariesResponse);
                const itinerariesData = itinerariesResponse || [];
                setItineraries(itinerariesData);

                // Separate itineraries with and without tourist bookings
                const bookedIten = itinerariesData.filter(itinerary => itinerary.isActive && itinerary.touristIds?.length > 0);
                const noTouristIten = itinerariesData.filter(itinerary => itinerary.isActive && (!itinerary.touristIds || itinerary.touristIds.length === 0));

                setTouristIten(bookedIten);
                setNotouristIten(noTouristIten);
                setFlag(bookedIten.length > 0);

            } else if (!isTourGuide ) {
                let str = String(user?.advertiser?._id);
                console.log("strs Advertiser", user?.advertiser?._id);
                
                const upcomingActivities = await fetchActivities(user?.advertiser?._id);
                const currentDate = new Date();
                const filteredActivities = upcomingActivities.filter(activity => new Date(activity.date) >= currentDate);
                console.log("filtered Activities", filteredActivities);
                setActivities(filteredActivities);
                
                // Separate activities with and without tourist bookings
                const bookedAct = filteredActivities.filter(activity => {
                  const hasTouristBookings = Array.isArray(activity.touristIds) && activity.touristIds.length > 0;
                  console.log("Activity:", activity._id, "Has bookings:", hasTouristBookings);
                  setFlag2(true)
                  return activity.bookingOpen && hasTouristBookings;
                });
                
                const noTouristAct = filteredActivities.filter(activity => {
                  const noBookings = !Array.isArray(activity.touristIds) || activity.touristIds.length === 0;
                  console.log("Activity:", activity._id, "No bookings:", noBookings);
                  return activity.bookingOpen && noBookings;
                });
                
                // Set the flag after filtering
                setTouristAct(bookedAct);
                setNotouristAct(noTouristAct);
                
                // Set flag based on whether there are any booked activities
               if(flag2 === true){
                setFlag(true)
               }
               else{
                setFlag(false)
               }
                console.log("Flag helper",flag2)
                console.log("Flag Booking", flag);  // This will still log the previous flag state due to async updates
                console.log("Booked Activities", bookedAct);
                console.log("No Tourist Activities", noTouristAct);
                
                
               
            
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError('Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    const userRef = useRef(null);

useEffect(() => {
    if (userRef.current !== user) {
        userRef.current = user;
        fetchData();
        console.log("booked",touristAct)
    }
}, [user]);

    useEffect(() => {
        const fetchUserData = async () => {
            await fetchData();
        };
        //const interval = setInterval(fetchUserData, 5000); // Poll every 5 seconds

        // Cleanup polling when component unmounts
       // return () => clearInterval(interval);
    
    }, [dataTA, isTourGuideA]); 
    useEffect(() => {
        if (user) {
            console.log("User:", user);
            if (userType === 'advertiser') {
                console.log("Advertiser ID:", user?.advertiser?._id);
            } else if (userType === 'tourGuide') {
                console.log("Tour Guide ID:", user?.tourGuide?._id);
            }
           
            // Continue with any logic that depends on user data
        }
    }, [user, userType]);

    const handleDeletion = async () => {
        
        if (!flag) {
            try {
                // Delete itineraries or activities without bookings
                if (userType === 'tourGuide' && user?.tourGuide?._id) {
                    await Promise.all(
                        itineraries.map(async itinerary => await deleteItinerary(itinerary._id))
                    );
                } else if (userType === 'advertiser' || !isTourGuideA ) {
                    console.log("it entries here")
                    await Promise.all(
                        activities.map(async activity => await deleteActivity(activity._id) )
                    );
                }

                // Delete user account
                if (userType === 'tourGuide' && user?.tourGuide?._id) {
                    await deleteTourGuide(user.tourGuide._id);
                } else if (userType === 'advertiser' && user.advertiser._id) {
                    await deletAdvertiser(user.advertiser._id);
                }

                alert('Your account has been deleted successfully.');
                setUser(null);
                setTouristAct([]);
                setTouristIten([]);
                setNotouristAct([]);
                setNotouristIten([]);
                
            } catch (err) {
                console.error("Error deleting account:", err);
                setError('Failed to delete account. Please try again later.');
            }
        } else {
            alert('Delete Account Request Rejected: Bookings were found.');
        }
        //const interval = setInterval(handleDeletion, 0);
        //return () => clearInterval(interval);
    }; 

    const debugInfo = () => {
        console.log("?????????????????Debug Info:??????????????????");
        console.log("User Type:", userType);
        console.log("User Data:", user);
        console.log("User ID tour guide", user?.tourGuide?._id)
        console.log("User ID advertiser", user?.advertiser?._id)
        console.log("Activities with Tourist IDs:", touristAct);
        console.log("Itineraries with Tourist IDs:", touristIten);
        console.log("Activities with NO Tourist IDs:", notouristAct);
        console.log("Itineraries with NO Tourist IDs:", notouristIten);
        console.log("All Activites", activities)
        console.log("All Iteniraries", itineraries)
        console.log("Flag:", flag);
    };

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Delete Account</h2>
            <button onClick={handleDeletion} disabled={flag}>
                {flag ? 'Delete Account (Not Available)' : 'Delete Account'}
            </button>
            {user && <p>Account Type: {userType === 'tourGuide' ? 'Tour Guide' : 'Advertiser'}</p>}
            <button onClick={debugInfo}>Debug Info</button>
        </div>
    );
};

export default DeleteTA;