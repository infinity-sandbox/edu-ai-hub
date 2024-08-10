import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const StripePaymentForm: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        // Create a payment intent on the server
        const { data: clientSecret } = await axios.post('http://localhost:3001/create-payment-intent', {
            amount: 2999,  // Amount to charge in cents
            currency: 'eur',
        });

        // Confirm the card payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement!,
            },
        });

        if (error) {
            console.error('Payment error:', error);
        } else if (paymentIntent?.status === 'succeeded') {
            console.log('Payment succeeded');
            closeModal();  // Close the modal on success
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay Now €29.99
            </button>
        </form>
    );
};

export default StripePaymentForm;
