import React, { useState, useEffect } from 'react';
import ActivityList from '../Components/ActivityList';
import CreateActivityForm from '../Components/CreateActivityForm';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { fetchActivities, deleteActivity, updateActivity } from '../Services/activityServices'; // Ensure this import is correct
import { fetchTransportationsByAdvertiserId } from '../Services/bookingTransportationServices';
import AdvertiserInfo from './AdvertiserInfo'; // Import AdvertiserInfo
import UploadDocumentsAdvertiser from './UploadDocumentsAdvertiser'
import styles from '../styles/Advertisor.module.css'; // Keep your existing global styles
import CreateTransportationForm from '../Components/createTransportationForm';
import TransportationDisplayForAdvertiser from '../Components/TransportationDisplayForAdvertiser';
import {editTransportation, deleteTransportation} from '../Services/bookingTransportationServices'
import { fetchAdvertiserByEmail } from '../RequestSendingMethods';
import updateAcceptedTermsAndConditions from '../Services/advertiserServices'



let advertiserId = "66f826b0e184e2faa3ea510b";

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
                <button onClick={onAccept}>back</button>
            </div>
        </div>
    );
  };

const AdvertiserPage = ({email}) => {
    const location = useLocation();

    const login = location.state?.login || false;
    if(login){
        const userData = JSON.parse(localStorage.getItem('userData'));
        email = userData?.email;
        advertiserId = userData?._id;
    }

    const [isCreating, setIsCreating] = useState(false);
    const [isCreatingTransportation, setIsCreatingTransportation] = useState(false);
    const [activities, setActivities] = useState([]);
    const [transportations, setTransportations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transportationerror, setTransportationError] = useState(null);
    const [transportationLoading, setTransportationLoading] = useState(null);
    const [uploadPage, setUploadPage]=useState(true); // default with true 
    const navigate = useNavigate();
    const [advertiserData, setAdvertiserData] = useState(null);
    
    
    useEffect(() => {
        const getAdvertiserData = async () => {
          try {
            console.log("Email el da5l  ad info :",email)
            const response = await fetchAdvertiserByEmail({ email });
            if (response) {
              setAdvertiserData(response.advertiser);
            }
          } catch (error) {
            console.error('Error fetching advertiser data:', error);
          }
        };
    
        if (email) {
          getAdvertiserData();
        }
        const interval = setInterval(() => {
            getAdvertiserData();
          }, 5000); // 5000ms = 5 seconds
        
          // Cleanup function to clear the interval
          return () => clearInterval(interval);
      }, [email]);

    const handleBackfromUploadPage = () => {
        setUploadPage(false);
      };
    const [termsAccepted, setTermsAccepted] = useState(false);


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
    const handleAcceptTerms = () => {
        setTermsAccepted(true); // Set terms as accepted
        updateAcceptedTermsAndConditions(advertiserData._id);
    };
    
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


    const r1 =()=>{
        console.log("00000000000")
        navigate("/");
        
      }

    if (uploadPage && !login){
        return <UploadDocumentsAdvertiser onBack={handleBackfromUploadPage} email={email} />
      }

    if (!termsAccepted && !login) {
      return <TermsAndConditionsModal onAccept={handleAcceptTerms} />;
    }

    if(advertiserData?.isPendingAcceptance || advertiserData?.isAccepted==="false"){
        return <NotAccepted onAccept={()=>r1()} />
    }
    // If viewing the profile, render only the AdvertiserInfo component
    if (isViewingProfile) {
        return <AdvertiserInfo email={email} onBack={handleBackButtonClick} id={advertiserId} />;
    }

    // Otherwise, render the main AdvertiserPage
    return (
        <div className={styles.advertisorPage}>
            {/* Display advertiser logo if it exists */}
            {advertiserData?.logo && console.log('Advertiser Logo URL:', advertiserData.logo) && (
                <div className={styles.logoContainer}>
                    <img 
                        src={advertiserData.logo} 
                        alt="Advertiser Logo" 
                        className={styles.logo} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'default-logo.png'; }} // Replace with a default image if there's an error
                    />
                </div>
            )}
 
            <div className={styles.navbar}>
            
            <button  className={styles.button2} onClick={() => navigate("/")}>
               Back to login page 
            </button>
            {/* Create Activity button */}
            <button  className={styles.button2} onClick={handleCreateButtonClick}>
                Create Activity
            </button>

            <button  className={styles.button2} onClick={handleCreateTransportationButtonClick} >
                Create Transportation
            </button>

            {/* View Profile Information button */}
            <button  className={styles.button2} onClick={handleViewProfileClick}>
                View Profile Information
            </button>
            </div>
            <h1 className={styles.header}>Advertiser Page</h1>
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
                <h1 className={styles.h1}>Transportations</h1>
                {transportations.map((transportation) => (
                    <TransportationDisplayForAdvertiser key={transportation._id} 
                    transportation={transportation} 
                    onEdit={handleEditTransportation} 
                    onDelete={handleDeleteTransportation}  />
                ))}
                <button className={styles.button} onClick={() => navigate("/")}>Back to login page</button>
            </div>
            
        </div>
    );
};

export default AdvertiserPage;
