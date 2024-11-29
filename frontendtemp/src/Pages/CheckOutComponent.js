import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { addDeliveryAddress, fetchDeliveryAddresses } from '../Services/TouristService';

const CheckOutComponent = ({ touristID, TouristEmail }) => {
  // State for selected address, address input, and list of added addresses
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [addresses, setAddresses] = useState([]); // To store multiple addresses
  const [error, setError] = useState(''); // For handling errors

  // Fetch addresses for the tourist when the component mounts
  useEffect(() => {
    const getAddresses = async () => {
      try {
        const fetchedAddresses = await fetchDeliveryAddresses(touristID);
        setAddresses(fetchedAddresses);
      } catch (error) {
        setError(error.message || 'Failed to load addresses');
      }
    };
    getAddresses();
  }, [touristID]); // Re-run when the touristID changes

  const handleViewCart = () => {
    // Placeholder action
    console.log('View Cart clicked');
  };

  const handleCheckOutOrder = () => {
    // Placeholder action
    console.log('Check Out Order clicked');
  };

  const handleAddAddress = async () => {
    if (addressInput.trim() !== '') {
      try {
        // Prepare address data to send to the server
        const addressData = { addresses: addressInput }; // Ensure 'addresses' key here
        
        // Call the addDeliveryAddress method to save the new address
        console.log("Address gotten from Form:", addressData);
        console.log("TouristId:", touristID);
        
        // Send the request to the backend to add the address
        await addDeliveryAddress(touristID, addressData);
        
        // Fetch updated list of addresses after adding a new one
        const updatedAddresses = await fetchDeliveryAddresses(touristID);
        setAddresses(updatedAddresses);

        setAddressInput(''); // Clear the input field
        console.log('New Address Added:', addressInput);
      } catch (error) {
        setError(error.message || 'Failed to add address');
        console.error('Error adding address:', error);
      }
    }
  };

  const handleSelectAddress = (address) => {
    // Set the selected address
    alert('Address selected successfully!');   
     setSelectedAddress(address);
    console.log(`Selected Address: ${address}`);
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Checkout Page</h2>
      </div>

      <div className="form-container">
        <div className="profile">
          <div className="profile-info">
            <label htmlFor="address">Select Address</label>
            <select
              id="address"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            >
              <option value="">--Choose an Address--</option>
              {addresses.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </select>
          </div>
          <button className="btn" onClick={() => handleSelectAddress(selectedAddress)}>
            Select an Address
          </button>
          <div className="profile-info">
            <label htmlFor="new-address">Add a New Address</label>
            <input
              type="text"
              id="new-address"
              placeholder="Enter new address"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button className="btn" onClick={handleAddAddress}>
              Add Address
            </button>
          </div>

          {/* Display error if there is any */}
          {/*error && <div className="error">{error}</div>*/}
        </div>
      </div>

      <div className="footer">
        <button className="btn" onClick={handleViewCart}>
          View Cart
        </button>
        <button className="btn" onClick={handleCheckOutOrder}>
          Check Out Order
        </button>
      </div>
    </div>
  );
};

export default CheckOutComponent;
