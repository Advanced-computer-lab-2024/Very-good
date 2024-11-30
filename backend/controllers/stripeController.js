const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Controller for creating a Payment Intent
const createPaymentIntent = async (req, res) => {
    const { amount, currency } = req.body; // Amount in the smallest currency unit (e.g., cents for USD)
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount to charge
            currency: currency, // Currency code
            automatic_payment_methods: { enabled: true }, // Enables multiple payment methods
        });

        res.status(200).send({ 
            clientSecret: paymentIntent.client_secret, // Send the client secret to the frontend 
        });
    } catch (error) {
        console.error('Error creating payment intent:', error.message);
        res.status(500).send({ error: error.message });
    }
};

module.exports = { createPaymentIntent };
