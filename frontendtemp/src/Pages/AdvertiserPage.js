import React, { useState } from 'react';
import ActivityList from '../Components/ActivityList';
import CreateActivityForm from '../Components/CreateActivityForm';
import AdvertiserInfo from './AdvertiserInfo'; // Import AdvertiserInfo
import './AdvertiserPage.css'; 

const advertiserId = "66f826b0e184e2faa3ea510b";

const AdvertiserPage = ({email}) => {
    const [isCreating, setIsCreating] = useState(false); // State to manage the visibility of the form
    const [isViewingProfile, setIsViewingProfile] = useState(false); // State to manage the profile info view

    const handleCreateButtonClick = () => {
        setIsCreating(true); // Show the form when the button is clicked
    };

    const handleViewProfileClick = () => {
        setIsViewingProfile(true); // Show the AdvertiserInfo and hide AdvertiserPage
    };

    const closeForm = () => {
        setIsCreating(false); // Hide the form
    };

    const handleBackButtonClick = () => {
        setIsViewingProfile(false); // Go back to the main AdvertiserPage and hide AdvertiserInfo
    };

    // If viewing the profile, render only the AdvertiserInfo component
    if (isViewingProfile) {
        return <AdvertiserInfo email={email} onBack={handleBackButtonClick} />;
    }

    // Otherwise, render the main AdvertiserPage
    return (
        <div>
            <h1>Advertiser Page</h1>
            <p>Welcome to the Advertiser page!</p>
            
            {/* Create Activity button */}
            <button className="create-activity-button" onClick={handleCreateButtonClick}>
                Create Activity
            </button>

            {/* View Profile Information button */}
            <button className="view-profile-button" onClick={handleViewProfileClick}>
                View Profile Information
            </button>

            {/* Render the CreateActivityForm if isCreating is true */}
            {isCreating && <CreateActivityForm onClose={closeForm} advertiserId={advertiserId}/>}

            {/* Call the ActivityList component */}
            <ActivityList advertiserId={advertiserId} />
        </div>
    );
};

export default AdvertiserPage;
