import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../../styles/mainPageStyle/PricingPlans.css';
import Modal from 'react-modal';

// Load Stripe with your publishable key
const stripePromise = loadStripe('your-publishable-key');

const PricingPlans: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [billingCycle, setBillingCycle] = useState('yearly');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Card');

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const toggleBillingCycle = () => {
        setBillingCycle((prev) => (prev === 'yearly' ? 'weekly' : 'yearly'));
    };

    return (
        <div className="pricing-container">
            <h2>Our Pricing Plans</h2>
            <p>We have three pricing plans below. You can also get started with a free trial, no credit card needed.</p>

            <div className="toggle-container" onClick={toggleBillingCycle}>
                <div className={`toggle-button ${billingCycle}`}>
                    <span>Weekly</span>
                    <span>Yearly</span>
                </div>
            </div>

            <div className="plans">
                <div className="plan basic">
                    <h3>Basic Plan</h3>
                    <p>For Small team needs</p>
                    <h4>$10<span>/mo</span></h4>
                    <ul>
                        <li>10 GB Disk Space</li>
                        <li>1 Year Support</li>
                        <li>500 Queries</li>
                        <li>Free Custom Domain</li>
                    </ul>
                    <button onClick={openModal}>Buy Now</button>
                </div>
                <div className="plan business highlighted-plan">
                    <h3>Business Plan</h3>
                    <p>For Small team needs</p>
                    <h4>$20<span>/mo</span></h4>
                    <ul>
                        <li>10 GB Disk Space</li>
                        <li>1 Year Support</li>
                        <li>500 Queries</li>
                        <li>Free Custom Domain</li>
                    </ul>
                    <button onClick={openModal}>Buy Now</button>
                </div>
                <div className="plan enterprise">
                    <h3>Enterprise Plan</h3>
                    <p>For Large team needs</p>
                    <h4>$40<span>/mo</span></h4>
                    <ul>
                        <li>50 GB Disk Space</li>
                        <li>3 Years Support</li>
                        <li>Unlimited Queries</li>
                        <li>Free Custom Domain</li>
                    </ul>
                    <button onClick={openModal}>Buy Now</button>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="modal"
                overlayClassName="overlay"
                contentLabel="Payment Modal"
            >
                <div className="payment-methods">
                    <button className={selectedPaymentMethod === 'Card' ? 'active' : ''} onClick={() => setSelectedPaymentMethod('Card')}>Card</button>
                    <button className={selectedPaymentMethod === 'PayPal' ? 'active' : ''} onClick={() => setSelectedPaymentMethod('PayPal')}>PayPal</button>
                </div>
                {selectedPaymentMethod === 'Card' && (
                    <Elements stripe={stripePromise}>
                        <StripePaymentForm closeModal={closeModal} />
                    </Elements>
                )}
                {selectedPaymentMethod === 'PayPal' && (
                    <PayPalPayment closeModal={closeModal} />
                )}
                <button onClick={closeModal} className="close-modal">Close</button>
            </Modal>
        </div>
    );
};

const StripePaymentForm: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        const { data: clientSecret } = await axios.post('http://localhost:3001/create-payment-intent', {
            amount: 2999,
            currency: 'eur'
        });

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement!,
            },
        });

        if (error) {
            console.error(error);
        } else if (paymentIntent?.status === 'succeeded') {
            console.log('Payment succeeded');
            closeModal();
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

const PayPalPayment: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
    useEffect(() => {
        window.paypal.Buttons({
            createOrder: async () => {
                const response = await axios.post('http://localhost:3001/create-paypal-order');
                return response.data.id;
            },
            onApprove: async (data: any) => {
                const response = await axios.post('http://localhost:3001/capture-paypal-order', {
                    orderId: data.orderID,
                });
                console.log('Payment captured:', response.data);
                closeModal();
            },
        }).render('#paypal-button-container');
    }, [closeModal]);

    return <div id="paypal-button-container"></div>;
};

export default PricingPlans;
