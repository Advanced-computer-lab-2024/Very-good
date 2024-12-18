import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/SellerPage.module.css'; 
const AdminCreateTag = () => {
    const [tagName, setTagName] = useState('');  // State to hold the entered tag name
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTagNameChange = (e) => {
        setTagName(e.target.value);  // Update the state when input value changes
    };

    // Action listener is commented out for now
    
    const handleCreateTag = async () => {
        try {
            setLoading(true);
            setError(null);

            // Prepare the request payload
            const tagData = {
                name: tagName,
                category: 'preference', // Setting the category to preference
            };

            // Send the POST request to create the tag
            const response = await axios.post('http://localhost:4000/api/tags/create', tagData);
            alert('Tag created successfully');
            console.log('Tag created successfully:', response.data);
            // Optionally, reset the input field
            setTagName('');
        } catch (err) {
            console.error('Error creating tag:', err.message);
            setError(err.message); // Set the error message to state
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className={styles['category-buttonms']}>
            <h2>Create a New Tag</h2>
            <form className={styles['category-buttons']} style={{margin : '0 auto'}}>
                <div className="form-group">
                    <label htmlFor="tagName">Tag Name:</label>
                    <input
                        type="text"
                        id="tagName"
                        value={tagName}
                        onChange={handleTagNameChange}
                        placeholder="Enter tag name"
                    />
                </div>
                <button
                    type="button" onClick={handleCreateTag}  // Placeholder to prevent form submission
                    // onClick={handleCreateTag}  // This is the commented action listener
                >
                    Create
                </button>
            </form>
            <button onClick={() => window.location.reload()}  className={styles.buttonj}>Back</button>
        </div>
    );
};

export default AdminCreateTag;
