import React, { useState, useEffect } from 'react';
import ActivityList from '../Components/ActivityList';
import CreateActivityForm from '../Components/CreateActivityForm';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { fetchActivities, deleteActivity, updateActivity } from '../Services/activityServices'; // Ensure this import is correct
import { fetchTransportationsByAdvertiserId } from '../Services/bookingTransportationServices';
import AdvertiserInfo from './AdvertiserInfo'; // Import AdvertiserInfo
import UploadDocumentsAdvertiser from './UploadDocumentsAdvertiser';
import './AdvertiserPage.css'; 
import CreateTransportationForm from '../Components/createTransportationForm';
import TransportationDisplayForAdvertiser from '../Components/TransportationDisplayForAdvertiser';
import {editTransportation, deleteTransportation} from '../Services/bookingTransportationServices';
import { fetchAdvertiserByEmail } from '../RequestSendingMethods';

// Initial hardcoded advertiserId
const staticAdvertiserId = "66f826b0e184e2faa3ea510b";

const TermsAndConditionsModal = ({ onAccept }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Terms and Conditions</h2>
                <p>Please Accept The Terms and Conditions to proceed.</p>
                <button onClick={onAccept}>Accept</button>
            </div>
        </div>
    );
};

const NotAccepted = ({ onAccept }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>Not Accepted.</p>
                <button onClick={onAccept}>Back</button>
            </div>
        </div>
    );
};

const AdvertiserPage = ({ email }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isCreatingTransportation, setIsCreatingTransportation] = useState(false);
    const [activities, setActivities] = useState([]);
    const [transportations, setTransportations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transportationError, setTransportationError] = useState(null);
    const [transportationLoading, setTransportationLoading] = useState(null);
    const [uploadPage, setUploadPage] = useState(true);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isViewingProfile, setIsViewingProfile] = useState(false);
    const navigate = useNavigate();

    // State to store the dynamically fetched advertiserId
    const [advertiserId, setAdvertiserId] = useState(staticAdvertiserId);

    const handleBackfromUploadPage = () => {
        setUploadPage(false);
    };

    // Function to fetch advertiser ID dynamically by email
    const fetchAdvertiserId = async () => {
        try {
            const response = await fetchAdvertiserByEmail({ email });
            setAdvertiserId(response?.advertiser?._id || staticAdvertiserId); // Fallback to hardcoded ID if fetch fails
        } catch (error) {
            console.error('Failed to fetch advertiser ID:', error);
        }
    };

    useEffect(() => {
        fetchAdvertiserId(); // Fetch advertiser ID on component mount
    }, [email]); // Re-run if email changes

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

    const fetchAndSetTransportations = async () => {
        try {
            const data = await fetchTransportationsByAdvertiserId(advertiserId);
            setTransportations(data);
        } catch (err) {
            setTransportationError(err.message);
        } finally {
            setTransportationLoading(false);
        }
    };

    useEffect(() => {
        fetchAndSetActivities();
        fetchAndSetTransportations();
    }, [advertiserId]); // Refetch activities and transportations when advertiserId changes

    const handleAcceptTerms = () => {
        setTermsAccepted(true);
    };

    const handleCreateButtonClick = () => {
        setIsCreating(true);
    };

    const handleViewProfileClick = () => {
        setIsViewingProfile(true);
    };

    const closeForm = () => {
        setIsCreating(false);
        fetchAndSetActivities();
    };

    const closeTransportationForm = () => {
        setIsCreatingTransportation(false);
        fetchAndSetTransportations();
    };

    const handleDeleteActivity = async (activityId) => {
        try {
            await deleteActivity(activityId);
            setActivities((prevActivities) => 
                prevActivities.filter(activity => activity._id !== activityId)
            );
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
            );
            return updatedActivity;
        } catch (err) {
            console.error('Failed to update activity:', err.message);
        }
    };

    const handleEditTransportation = async (transportationId, updatedData) => {
        try {
            const updatedTransportation = await editTransportation(transportationId, updatedData);
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
            await deleteTransportation(transportationId);
            setTransportations((prevTransportations) => 
                prevTransportations.filter(transportation => transportation._id !== transportationId)
            );
            await fetchAndSetTransportations();
        } catch (err) {
            console.error('Failed to delete transportation:', err.message);
        }
    };

    if (loading) return <p>Loading activities...</p>;
    if (error) return <p>Error fetching activities: {error}</p>;
    if (transportationLoading) return <p>Loading transportations...</p>;

    const handleBackButtonClick = () => {
        setIsViewingProfile(false);
    };

    const handleCreateTransportationButtonClick = () => {
        setIsCreatingTransportation(true);
    };

    if (uploadPage) {
        return <UploadDocumentsAdvertiser onBack={handleBackfromUploadPage} email={email} />;
    }

    if (!termsAccepted) {
        return <TermsAndConditionsModal onAccept={handleAcceptTerms} />;
    }

    if (isViewingProfile) {
        return <AdvertiserInfo email={email} onBack={handleBackButtonClick} />;
    }

    return (
        <div>
            <h1>Advertiser Page</h1>
            
            <button className="create-activity-button" onClick={handleCreateButtonClick}>
                Create Activity
            </button>

            <button className="create-transportation-button" onClick={handleCreateTransportationButtonClick}>
                Create Transportation
            </button>

            <button className="view-profile-button" onClick={handleViewProfileClick}>
                View Profile Information
            </button>

            {isCreating && <CreateActivityForm onClose={closeForm} advertiserId={advertiserId} setActivities={setActivities} />}
            {isCreatingTransportation && <CreateTransportationForm onClose={closeTransportationForm} advertiserId={advertiserId} />}

            <ActivityList 
                activities={activities} 
                onDelete={handleDeleteActivity} 
                onUpdate={handleUpdateActivity} 
            />

            <div>
                <h1>Transportations</h1>
                {transportations.map((transportation) => (
                    <TransportationDisplayForAdvertiser 
                        key={transportation._id} 
                        transportation={transportation} 
                        onEdit={handleEditTransportation} 
                        onDelete={handleDeleteTransportation}  
                    />
                ))}
            </div>
        </div>
    );
};

export default AdvertiserPage;