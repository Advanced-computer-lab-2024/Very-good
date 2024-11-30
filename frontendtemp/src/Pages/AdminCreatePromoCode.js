import React, { useState } from 'react';
import axios from 'axios';
const AdminCreatePromoCode = () => {
    const [promoCode, setPromoCode] = useState('');  // State to hold the entered tag name
    const [percentage, setPercentage] = useState(0);  // State to hold the entered tag name
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePromoCodeChange = (e) => {
        setPromoCode(e.target.value);  // Update the state when input value changes
    };

    const handlePercentageChange = (e) => {
        setPercentage(e.target.value);  // Update the state when input value changes
    }

    // Action listener is commented out for now
    
    const handleCreatePromoCode = async () => {
        try {
            setLoading(true);
            setError(null);

            // Prepare the request payload
            const promoData = {
                title: promoCode,
                percentage: percentage, // Setting the category to preference
            };

            // Send the POST request to create the tag
            const response = await axios.post('http://localhost:4000/api/promoCodes/', promoData);
            
            console.log('Promo created successfully:', response.data);
            // Optionally, reset the input field
            setPromoCode('');
            setPercentage(0);
        } catch (err) {
            console.error('Error creating promo:', err.message);
            setError(err.message); // Set the error message to state
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-create-tag">
            <h2>Create a New Promo Code</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="promoCode">Promo Code:</label>
                    <input
                        type="text"
                        id="promoCode"
                        value={promoCode}
                        onChange={handlePromoCodeChange}
                        placeholder="Enter promo code"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="percentage">Percentage:</label>
                    <input
                        type="number"
                        min={0}
                        max={100}
                        id="percentage"
                        value={percentage}
                        onChange={handlePercentageChange}
                        placeholder="Enter percentage"
                    />
                </div>

                <button
                    type="button" onClick={handleCreatePromoCode}  // Placeholder to prevent form submission
                    // onClick={handleCreateTag}  // This is the commented action listener
                >
                    Create
                </button>
            </form>
        </div>
    );
};

export default AdminCreatePromoCode;
