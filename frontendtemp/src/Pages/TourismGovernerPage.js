// TouristPage.js
import React ,{ useState } from 'react';
import './AdvertiserPage.css'; 
import CreateMusuemForm from '../Components/CreateMuseumForm';
import MuseumList from '../Components/MusuemList';


const TourismGovernerPage = () => {
  const [isCreating, setIsCreating] = useState(false); // State to manage the visibility of the form

  const handleCreateButtonClick = () => {
      setIsCreating(true); // Show the form when the button is clicked
  };

  const closeForm = () => {
      setIsCreating(false); // Hide the form
  };
  

  return (
      <div>
          <h1>Tourism Governer Page</h1>
          <p>Welcome to the Tourism Governer Page!</p>
          
          {/* Create Activity button */}
          <button className="create-activity-button" onClick={handleCreateButtonClick}>
              Create Musuem/Historical Place
          </button>

          {isCreating && <CreateMusuemForm onClose={closeForm}/>}

          <MuseumList/>

      </div>
  );
};

export default TourismGovernerPage;