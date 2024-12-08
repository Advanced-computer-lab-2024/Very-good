import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/global.css';
import { addDeliveryAddress, fetchDeliveryAddresses } from '../Services/TouristService';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../Components/PaymentForm'; // Import the PaymentForm component
import axios from 'axios';


const stripePromise = loadStripe('pk_test_51QP6GEIjdL7iHsR6Zjy5EB8ixOlCfL2PnqICOkaAorgK8zFYvpnsDeHCZSx78V0uBCIaZ8uvdtVbw2FYPCbKxWMx00qSClGNRP'); // Replace with your Stripe publishable key

const CheckOutComponent = () => {
  const location = useLocation(); // Initialize useLocation
  const navigate = useNavigate(); // Initialize useNavigate
  const touristID = location.state?.TouristID; // Get touristID from state
  const totalPrice = location.state?.totalPrice; // Get totalPrice from state
  console.log('TouristID:', touristID); // Log touristID to console
  console.log('Total Price:', totalPrice); // Log totalPrice to console

  // State for selected address, address input, and list of added addresses
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [addresses, setAddresses] = useState([]); // To store multiple addresses
  const [error, setError] = useState(''); // For handling errors
  const [paymentMethod, setPaymentMethod] = useState(''); // State for payment method
  const [clientSecret, setClientSecret] = useState(''); // Add state for clientSecret
  const [promoCode, setPromoCode] = useState(''); // State for selected promo code
  const [promoCodes, setPromoCodes] = useState([]); // State for list of promo codes
  const [promoCodePercentage, setPromoCodePercentage] = useState(0); // State for selected promo code percentage

  const calculateDiscountedPrice = (price, discountPercentage) => {
    return price - (price * discountPercentage / 100);
  };

  useEffect(() => {
    const fetchClientSecret = async () => {
        if (paymentMethod === 'credit-card' && totalPrice) {
            try {
                const response = await axios.post('http://localhost:4000/api/payments/create-payment-intent', {
                    amount: totalPrice * 100, // Convert to cents (smallest currency unit)
                    currency: 'usd', // Default to USD if not provided
                });
                setClientSecret(response.data.clientSecret);
            } catch (error) {
                console.error('Error creating payment intent:', error);
            }
        }
    };

    fetchClientSecret();
}, [paymentMethod, totalPrice]);

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

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/promoCodes');
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching promo codes:', error);
        return [];
      }
    };
  
    const fetchUserPromoCodes = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/promoCodes/${touristID}`);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching user promo codes:', error);
        return [];
      }
    };
  
    const fetchAllPromoCodes = async () => {
      const [genericPromoCodes, userPromoCodes] = await Promise.all([fetchPromoCodes(), fetchUserPromoCodes()]);
      setPromoCodes([...genericPromoCodes, ...userPromoCodes]);
    };
  
    if (touristID) {
      fetchAllPromoCodes();
    }
  }, [touristID]); // Fetch promo codes when the component mounts and when touristID changes

  const handleViewCart = () => {
    // Placeholder action
    console.log('View Cart clicked');
  };

  const handleCheckOutOrder = () => {
    const credit = paymentMethod === 'credit-card';
    console.log("TouristID :", touristID, "Credit:", credit, "PromoCodePercentage:", promoCodePercentage);
    navigate('/tourist/viewOrders', { state: { TouristID: touristID, credit, promoCodePercentage } });
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

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePromoCodeChange = (e) => {
    const selectedCode = e.target.value;
    setPromoCode(selectedCode);
    const selectedPromo = promoCodes.find(code => code.title === selectedCode);
    setPromoCodePercentage(selectedPromo ? selectedPromo.percentage : 0);
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

          <div className="profile-info">
            <label htmlFor="payment-method">Select Payment Method</label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <option value="">--Choose a Payment Method--</option>
              <option value="wallet">Wallet</option>
              <option value="credit-card">Credit Card</option>
            </select>
          </div>

          <div className="profile-info">
            <label htmlFor="promo-code">Select Promo Code</label>
            <select
              id="promo-code"
              value={promoCode}
              onChange={handlePromoCodeChange}
            >
              <option value="">--Choose a Promo Code--</option>
              {promoCodes.map((code, index) => (
                <option key={index} value={code.title}>
                  {code.title} ({code.percentage}%)
                </option>
              ))}
            </select>
          </div>

          {/* Display error if there is any */}
          {/*error && <div className="error">{error}</div>*/}
          {paymentMethod==="credit-card" && clientSecret && (
                console.log("clientSecret in booking.js : ",clientSecret),
                console.log("stripePromise in booking.js : ",stripePromise),    
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  {promoCodePercentage > 0 ? (
                    <PaymentForm data={{ price: calculateDiscountedPrice(totalPrice, promoCodePercentage).toFixed(2), currency: 'usd' }} />
                  ) : (
                    <PaymentForm data={{ price: totalPrice, currency: 'usd' }} />
                  )}
                </Elements>
            )}
        </div>
        <h4>{`Total Price: $${totalPrice}`}</h4> {/* Display total price */}
        {promoCodePercentage > 0 && (
          <h4>{`Discounted Price: $${calculateDiscountedPrice(totalPrice, promoCodePercentage).toFixed(2)}`}</h4> 
        )}
      </div>

      <div className="footer">
        <h3>{`Total Price: $${totalPrice}`}</h3> {/* Display total price */}
        {promoCodePercentage > 0 && (
          <h3>{`Discounted Price: $${calculateDiscountedPrice(totalPrice, promoCodePercentage).toFixed(2)}`}</h3> 
        )}
        <button className="btn" onClick={handleCheckOutOrder}>
          Check Out Order
        </button>
      </div>
    </div>
  );
};

export default CheckOutComponent;
