import React, { useEffect, useState } from 'react';

import { fetchComplaintsByEmail } from '../RequestSendingMethods';
import styles from '../styles/TouristPage.module.css'; // Import CSS Module
const ViewMyComplaint = ({email}) => {
  
  //const email = location.state?.email; // Access the email from the location state

  console.log("Email passed to ViewMyComplaint:", email); // Log the email value

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getComplaints = async () => {
      if (!email) {
        console.error("Email is undefined, cannot fetch complaints.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchComplaintsByEmail(email);
        
        console.log("Response from fetchComplaintsByEmail:", response); // Log the response

        // Assuming response is an array directly
        if (Array.isArray(response)) {
          setComplaints(response); // Set complaints directly as response is an array
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    getComplaints();
  }, [email]);

  return (
    <div>
      <h1 style={{color : '#1F4529'}}>My Complaints</h1>
      {loading ? (
        <p>Loading...</p>
      ) : complaints.length > 0 ? (
      
        <ul>
            
          {complaints.map((complaint) => (
            <div className={styles['category-buttons']} style={{marginLeft : "-5%"}}>
            <li key={complaint._id}> {/* Use the unique ID */}
              <h3  style={{color : '#1F4529'}} >{complaint.title}</h3> {/* Display complaint title */}
              <p>{complaint.body}</p> {/* Display complaint body */}
              <p>Date: {new Date(complaint.date).toLocaleString()}</p> {/* Format date */}
              <p>Status: {complaint.isResolved ? "Resolved" : "Not Resolved"}</p> {/* Display status */}
            </li>
             </div>
          ))}
          
        </ul>
       
      ) : (
        <p>No complaints found.</p>
      )}
      <button className='btn' onClick={() => window.location.reload()}> Back</button>
    </div>
  );
};

export default ViewMyComplaint;