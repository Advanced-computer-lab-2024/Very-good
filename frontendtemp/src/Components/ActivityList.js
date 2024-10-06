import React, { useEffect, useState } from 'react';
import ActivityDisplay from './ActivityDisplay';
import { fetchActivities, deleteActivity, updateActivity, searchactivity } from '../Services/activityServices'; // Adjust the import path as needed

const ActivityList = ({ advertiserId }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm , setSearchTerm] = useState('');

    useEffect(() => {
        const getActivities = async () => {
            try {
                console.log('Advertiser ID:', advertiserId);
                const data = await fetchActivities(advertiserId);
                setActivities(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getActivities();
    }, [advertiserId]);

    const handleDeleteActivity = async (activityId) => {
        try {
            await deleteActivity(activityId); // Call the delete function from services
            setActivities(activities.filter(activity => activity._id !== activityId)); // Update the state
        } catch (err) {
            console.error('Failed to delete activity:', err.message);
        }
    };

    const handleUpdateActivity = async (activityId, updatedData) => {
        try {
            const updatedActivity = await updateActivity(activityId, updatedData); // Call the update function from services
            setActivities(prevActivities => 
                prevActivities.map(activity => 
                    activity._id === updatedActivity._id ? updatedActivity : activity
                )
            ); // Update the state with the new data
            return updatedActivity;
        } catch (err) {
            console.error('Failed to update activity:', err.message);
        }
    };

    // const handleSearch = async () => {
    //     setLoading(true);
    //     setError(null);
        
    //     try {
    //         const queryParams = [];
            
    //         if (searchTerm.name) {
    //             queryParams.push(`name=${encodeURIComponent(searchTerm.name)}`);
    //         }
    //         if (searchTerm.category) {
    //             queryParams.push(`category=${encodeURIComponent(searchTerm.category)}`);
    //         }
    //         if (searchTerm.tag) {
    //             queryParams.push(`tag=${encodeURIComponent(searchTerm.tag)}`);
    //         }
    
    //         const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    //         console.log('Search URL:', `http://localhost:4000/api/activities/search?${queryString}`); // For debugging
    
    //         const results = await searchactivity(queryString); // Call the service with the query string
    //         setActivities(results);
    //     } catch (err) {
    //         setError('Failed to fetch activities');
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    

    // const handleSearch = async() => {
    //     setLoading(true);
    //     setError(null);
    
    //     try {
    //         const results = await searchactivity(searchTerm); // Pass the search term as name for activities
    //         setActivities(results); // Set the results
    //     } catch (err) {
    //         setError('Failed to fetch activities');
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    if (loading) return <p>Loading activities...</p>;
    if (error) return <p>Error neek: {error}</p>;

    return (
        <div className="container">
            <h1>Activities</h1>
            {/* Search input */}
            {/* <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search by name, category, or tag" 
            /> */}
            {/* <button onClick={handleSearch}>Search</button> */}
            {activities.length === 0 ? (
                <p>No activities found.</p>
            ) : (
                activities.map((activity) => (
                    <ActivityDisplay key={activity._id} activity={activity} onDelete={handleDeleteActivity} onUpdate={handleUpdateActivity}/>
                ))
            )}
        </div>
    );
};

export default ActivityList;