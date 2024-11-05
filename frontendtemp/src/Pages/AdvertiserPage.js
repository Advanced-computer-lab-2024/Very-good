import React, { useState, useEffect } from 'react';
import ActivityList from '../Components/ActivityList';
import CreateActivityForm from '../Components/CreateActivityForm';
import { fetchActivities, deleteActivity, updateActivity } from '../Services/activityServices'; // Ensure this import is correct
import { fetchTransportationsByAdvertiserId } from '../Services/bookingTransportationServices';
import AdvertiserInfo from './AdvertiserInfo'; // Import AdvertiserInfo
import UploadDocumentsAdvertiser from './UploadDocumentsAdvertiser'
import './AdvertiserPage.css'; 
import CreateTransportationForm from '../Components/createTransportationForm';
import TransportationDisplayForAdvertiser from '../Components/TransportationDisplayForAdvertiser';
import {editTransportation, deleteTransportation} from '../Services/bookingTransportationServices'

const advertiserId = "66f826b0e184e2faa3ea510b";

const AdvertiserPage = ({email}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isCreatingTransportation, setIsCreatingTransportation] = useState(false);
    const [activities, setActivities] = useState([]);
    const [transportations, setTransportations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transportationerror, setTransportationError] = useState(null);
    const [transportationLoading, setTransportationLoading] = useState(null);
    const [uploadPage, setUploadPage]=useState(true); // default with true 

    const handleBackfromUploadPage = () => {
        setUploadPage(false);
      };

    const fetchAndSetActivities = async () => {
        try {
            const data = await fetchActivities(advertiserId);
            setActivities(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditTransportation = async (transportationId, updatedData) => {
        try {
            const updatedTransportation = await editTransportation(transportationId, updatedData); // Make sure to implement this function in your service
            setTransportations((prevTransportations) => 
                prevTransportations.map(transportation => 
                    transportation._id === updatedTransportation._id ? updatedTransportation : transportation
                )
            );
            await fetchAndSetTransportations();
            return updatedTransportation;
        } catch (err) {
            console.error('Failed to update transportation:', err.message);
        }
    };
    
    const handleDeleteTransportation = async (transportationId) => {
        try {
            await deleteTransportation(transportationId); // Call the delete function
            setTransportations((prevTransportations) => 
                prevTransportations.filter(transportation => transportation._id !== transportationId)
            ); // Update the transportations state
            await fetchAndSetTransportations();
        } catch (err) {
            console.error('Failed to delete transportation:', err.message);
        }
    };

    const fetchAndSetTransportations = async () => {
        try {
            const data = await fetchTransportationsByAdvertiserId(advertiserId);
            setTransportations(data);
        }
        catch (err){
            setTransportationError(err.message);
        }
        finally {
            setTransportationLoading(false);
        }
    }

    useEffect(() => {
        fetchAndSetActivities(); // Fetch activities on mount
        fetchAndSetTransportations();
    }, []);
    const [isViewingProfile, setIsViewingProfile] = useState(false); // State to manage the profile info view

    const handleCreateButtonClick = () => {
        setIsCreating(true); // Show the form when the button is clicked
    };

    const handleViewProfileClick = () => {
        setIsViewingProfile(true); // Show the AdvertiserInfo and hide AdvertiserPage
    };

    const closeForm = () => {
        setIsCreating(false); // Hide the form
        fetchAndSetActivities(); // Refetch activities after closing the form
    };

    const closeTransportationForm = () => {
        setIsCreatingTransportation(false);
        fetchAndSetTransportations();
    }

    const handleDeleteActivity = async (activityId) => {
        try {
            await deleteActivity(activityId); // Call the delete function
            setActivities((prevActivities) => 
                prevActivities.filter(activity => activity._id !== activityId)
            ); // Update the activities state
        } catch (err) {
            console.error('Failed to delete activity:', err.message);
        }
    };

    const handleUpdateActivity = async (activityId, updatedData) => {
        try {
            const updatedActivity = await updateActivity(activityId, updatedData);
            setActivities((prevActivities) => 
                prevActivities.map(activity => 
                    activity._id === updatedActivity._id ? updatedActivity : activity
                )
            ); // Update the state with the new data
            return updatedActivity;
        } catch (err) {
            console.error('Failed to update activity:', err.message);
        }
    };

    if (loading) return <p>Loading activities...</p>;
    if (error) return <p>Error fetching activities: {error}</p>;

    if (transportationLoading) return <p>Loading transportations...</p>;
    //if (transportationerror) return <p>Error fetching transportations: {error}</p>;

    const handleBackButtonClick = () => {
        setIsViewingProfile(false); // Go back to the main AdvertiserPage and hide AdvertiserInfo
    };

    const handleCreateTransportationButtonClick = () => {
        setIsCreatingTransportation(true);
    }




    if (uploadPage){
        return <UploadDocumentsAdvertiser onBack={handleBackfromUploadPage} email={email} />
      }
    // If viewing the profile, render only the AdvertiserInfo component
    if (isViewingProfile) {
        return <AdvertiserInfo email={email} onBack={handleBackButtonClick} />;
    }


    // Otherwise, render the main AdvertiserPage
    return (
        <div>
            <h1>Advertiser Page</h1>
            
            {/* Create Activity button */}
            <button className="create-activity-button" onClick={handleCreateButtonClick}>
                Create Activity
            </button>

            <button className="create-transportation-button" onClick={handleCreateTransportationButtonClick} >
                Create Transportation
            </button>

            {/* View Profile Information button */}
            <button className="view-profile-button" onClick={handleViewProfileClick}>
                View Profile Information
            </button>

            {/* Render the CreateActivityForm if isCreating is true */}
            {isCreating && <CreateActivityForm onClose={closeForm} advertiserId={advertiserId} setActivities={setActivities} />}

            {isCreatingTransportation && <CreateTransportationForm onClose={closeTransportationForm} advertiserId={advertiserId} />}

            {/* Call the ActivityList component and pass activities and handlers */}
            <ActivityList 
                activities={activities} 
                onDelete={handleDeleteActivity} 
                onUpdate={handleUpdateActivity} 
            />

            <div>
                <h1>Transportations</h1>
                {transportations.map((transportation) => (
                    <TransportationDisplayForAdvertiser key={transportation._id} 
                    transportation={transportation} 
                    onEdit={handleEditTransportation} 
                    onDelete={handleDeleteTransportation}  />
                ))}
            </div>

        </div>
    );
};

export default AdvertiserPage;
