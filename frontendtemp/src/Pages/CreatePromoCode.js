import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const CreatePromoCode = () => {
    const [title, setTitle] = useState('');
    const [percentage, setPercentage] = useState('');
    const [promoCodes, setPromoCodes] = useState([]);

    const handleCreatePromoCode = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/promoCodes/', {
                title,
                percentage
            });
            //alert('Promo code created successfully!');
            setTitle('');
            setPercentage('');
            fetchPromoCodes(); // Refresh the list of promo codes
        } catch (error) {
            console.error('Error creating promo code:', error);
            alert('Failed to create promo code.');
        }
    };

    const fetchPromoCodes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/promoCodes/');
            setPromoCodes(response.data.promoCodes);
            console.log("fetched promo codes", response.data);
        } catch (error) {
            console.error('Error fetching promo codes:', error);
        }
    };

    const handleDeletePromoCode = async (promoCodeId) => {
        try {
            await axios.delete(`http://localhost:4000/api/promoCodes/${promoCodeId}`);
            //alert('Promo code deleted successfully!');
            fetchPromoCodes(); // Refresh the list of promo codes
        } catch (error) {
            console.error('Error deleting promo code:', error);
            alert('Failed to delete promo code.');
        }
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    return (
        <div>
            <h2>Create Promo Code</h2>
            <form onSubmit={handleCreatePromoCode}>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Percentage:
                    <input
                        type="number"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Create</button>
            </form>
            <h3>Created Promo Codes</h3>
            <div className="promo-codes-container">
                {promoCodes.length > 0 ? (
                    promoCodes.map((promoCode) => (
                        <div key={promoCode._id} className="activity-card">
                            <div className="activity-title">{promoCode.title}</div>
                            <div className="activity-percentage">Percentage : {promoCode.percentage}%</div>
                            <FontAwesomeIcon 
                                icon={faTrash} 
                                className="delete-icon" 
                                onClick={() => handleDeletePromoCode(promoCode._id)} 
                            />
                        </div>
                    ))
                ) : (
                    <p>No promo codes available.</p>
                )}
            </div>
        </div>
    );
};

export default CreatePromoCode;