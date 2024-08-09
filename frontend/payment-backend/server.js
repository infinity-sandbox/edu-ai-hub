require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Stripe payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// PayPal environment setup
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// PayPal order creation endpoint
app.post('/create-paypal-order', async (req, res) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'EUR',
                value: '29.99'
            }
        }]
    });

    try {
        const order = await client.execute(request);
        res.status(200).send({
            id: order.result.id,
        });
    } catch (error) {
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
        res.status(500).send({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
