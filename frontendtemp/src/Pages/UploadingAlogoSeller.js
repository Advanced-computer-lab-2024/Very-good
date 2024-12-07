import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SellerPage.module.css'; // Keep your existing global styles
const UploadingAlogoSeller= ({ onBack, email }) => {
  const [photo, setPhoto] = useState(null); // Holds the uploaded photo file
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handle photo file selection
  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  // Submit the form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!photo) {
      setErrorMessage('Please upload a photo.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', photo); // Appending the photo file

    try {
      const response = await axios.post(`http://localhost:4000/api/sellers/uploadPhoto/${email}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Upload successful:', response.data);
    } catch (error) {
      setErrorMessage('Upload failed. Please try again.');
    }
  };

  return (
    <div >
      <h1>Upload Your Photo</h1>
    <div style={{marginLeft : "25%" }}>
      
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit} className={styles["category-buttons"] }> 
        <div>
          <label>Photo:</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} required />
        </div>
        <button type="submit">Upload Photo</button>
      </form>
      <button className="btn" onClick={onBack}>Back</button> {/* Call onBack when back is clicked */}
    </div>
    </div>
  );
};

export default UploadingAlogoSeller;
