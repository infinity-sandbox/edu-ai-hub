require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware configuration
app.use(cors({ origin: 'http://localhost:3000' })); // Replace with your actual frontend domain
app.use(bodyParser.json());

// Example pricing structure
const PRICING_PLANS = {
    weekly: {
        basic: 500,      // $5.00
        business: 1000,  // $10.00
        enterprise: 2000 // $20.00
    },
    yearly: {
        basic: 2999,     // $29.99
        business: 5999,  // $59.99
        enterprise: 9999 // $99.99
    }
};

// Endpoint to get pricing based on billing cycle
app.post('/get-pricing', (req, res) => {
    const { billingCycle } = req.body;

    console.log('Received pricing request:', req.body);  // Log the request for debugging

    if (!billingCycle) {
        return res.status(400).json({ error: 'Missing billingCycle.' });
    }

    const prices = PRICING_PLANS[billingCycle];
    if (!prices) {
        console.error('Invalid billing cycle:', billingCycle);  // Log invalid values
        return res.status(400).json({ error: 'Invalid billing cycle.' });
    }

    res.json(prices);
});


// Stripe payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // amount is already in cents
            currency: currency,
        });
        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe Error:', error.message);
        res.status(500).send({ error: error.message });
    }
});

// PayPal SDK environment setup
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// PayPal order creation endpoint
app.post('/create-paypal-order', async (req, res) => {
    const { amount, currency } = req.body;
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: currency,
                value: amount.toFixed(2) // Ensure amount is formatted correctly
            }
        }]
    });

    try {
        const order = await client.execute(request);
        res.status(200).send({
            id: order.result.id,
        });
    } catch (error) {
        console.error('PayPal Error:', error.message);
        res.status(500).send({ error: error.message });
    }
});

// PayPal order capture endpoint
app.post('/capture-paypal-order', async (req, res) => {
    const { orderId } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    try {
        const capture = await client.execute(request);
        res.status(200).send(capture.result);
    } catch (error) {
        console.error('Capture PayPal Order Error:', error.message);
        res.status(500).send({ error: error.message });
    }
});

// Endpoint to fetch PayPal Client ID
app.get('/paypal-client-id', (req, res) => {
    res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Starting the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
