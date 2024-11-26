import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = ({ data , handlePayment}) => {
    const location = useLocation();
    const { bookingData } = location.state; // bookingData: booking details
    const { price, currency } = data;
    console.log("price inside PaymentForm : ", price);
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false); // To handle loading state
    const [paymentSuccess, setPaymentSuccess] = useState(false); // To track payment status

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        if (!stripe || !elements) {
            console.error('Stripe.js has not loaded yet.');
            setIsProcessing(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            // Step 1: Request a PaymentIntent from the backend
            const response = await axios.post('http://localhost:4000/api/payments/create-payment-intent', {
                amount: price * 100, // Convert to cents (smallest currency unit)
                currency: currency || 'usd', // Default to USD if not provided
            });

            console.log("response inside PaymentForm : ", response.data.clientSecret);

            const clientSecret  = response.data.clientSecret;

            // Step 2: Confirm the payment with Stripe.js
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                console.error('Payment confirmation error:', error.message);
                alert(`Payment failed: ${error.message}`);
                setIsProcessing(false);
                return;
            }

            // Step 3: Handle successful payment
            if (paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded:', paymentIntent);
                setPaymentSuccess(true);
                try{
                    handlePayment();
                    alert('Payment successful! Booking confirmed.');
                }
                catch(error){   
                    console.log("error inside PaymentForm : ", error);
                }

                // Optional: Send confirmation to the backend for record-keeping
                //await axios.post('http://localhost:4000/api/bookings/', { ...bookingData });
            }
        } catch (error) {
            console.error('Error processing payment:', error.message);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            {paymentSuccess ? (
                <div>
                    <h3>Payment Successful!</h3>
                    <p>Your booking has been confirmed.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h3>Enter your card details</h3>
                    <CardElement />
                    <button type="submit" disabled={!stripe || isProcessing}>
                        {isProcessing ? 'Processing...' : `Pay $${price}`}
                    </button>
                </form>
            )}
        </div>
    );
};

export default PaymentForm;
