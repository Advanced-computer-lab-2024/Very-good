// AdminDelete.js
import React, { useState } from 'react';
import TouristAccountsList from './TouristAccountsList';
import SellerAccountsList from './SellerAccountsList';
import AdvertiserAccountsList from './AdvertiserAccountsList';
import TourGuideAccountsList from './TourGuideAccountsList';
import TourismGovernerAccountsList from './TourismGovernerAccountsList';
import styles from '../styles/SellerPage.module.css'; 
const AdminDelete = ({ onBack }) => {
    const [selectedOption, setSelectedOption] = useState(null); // State to hold the selected account type

    const handleOptionSelect = (option) => {
        setSelectedOption(option); // Set the selected option
    };

    // Render the appropriate component based on selected option
    const renderSelectedComponent = () => {
        switch (selectedOption) {
            case 'Tourist':
                return <TouristAccountsList onBack={() => setSelectedOption(null)} />;
            case 'Advertiser':
                return <AdvertiserAccountsList onBack={() => setSelectedOption(null)} />;
            case 'TourGuide':
                return <TourGuideAccountsList onBack={() => setSelectedOption(null)} />;
            case 'Seller':
                return <SellerAccountsList onBack={() => setSelectedOption(null)} />;
            case 'TourismGovernor':
                return <TourismGovernerAccountsList onBack={() => setSelectedOption(null)} />;
            default:
                return null;
        }
    };

    return (
        <div className={styles['category-buttons']}  style={{margin : '0 auto' }}>
            <h3>Select an account type to delete:</h3>
            <div>
                <button onClick={() => handleOptionSelect('Tourist')}  className={styles.button}>Delete Tourist</button>
                <button onClick={() => handleOptionSelect('Advertiser')} className={styles.button}>Delete Advertiser</button>
                <button onClick={() => handleOptionSelect('TourGuide')} className={styles.button}>Delete Tour Guide</button>
                <button onClick={() => handleOptionSelect('Seller')} className={styles.button}>Delete Seller</button>
                <button onClick={() => handleOptionSelect('TourismGovernor')} className={styles.button}>Delete Tourism Governor</button>
            </div>
            {renderSelectedComponent()} {/* Conditionally render based on selection */}
            <button onClick={onBack}>Back </button>
        </div>
    );
};

export default AdminDelete;
