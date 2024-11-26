const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/stripeController'); // Import the controller

// Route for creating a payment intent
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;