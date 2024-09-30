// TouristPage.js
import React ,{ useState } from 'react';
import ActivityList from '../Components/ActivityList';
import './AdvertiserPage.css'; 
import CreateActivityForm from '../Components/CreateActivityForm';

const advertiserId = "66f826b0e184e2faa3ea510b"

const AdvertiserPage = () => {
  const [isCreating, setIsCreating] = useState(false); // State to manage the visibility of the form

  const handleCreateButtonClick = () => {
      setIsCreating(true); // Show the form when the button is clicked
  };

  const closeForm = () => {
      setIsCreating(false); // Hide the form
  };

  return (
      <div>
          <h1>Advertiser Page</h1>
          <p>Welcome to the Advertiser page!</p>
          
          {/* Create Activity button */}
          <button className="create-activity-button" onClick={handleCreateButtonClick}>
              Create Activity
          </button>

          {/* Render the CreateActivityForm if isCreating is true */}
          {isCreating && <CreateActivityForm onClose={closeForm} advertiserId={advertiserId}/>}

          {/* Call the ActivityList component */}
          <ActivityList advertiserId={advertiserId} />
      </div>
  );
};

export default AdvertiserPage;