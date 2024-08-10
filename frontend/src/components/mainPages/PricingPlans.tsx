import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../../styles/mainPageStyle/PricingPlans.css';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// global.d.ts
export {};

declare global {
    interface Window {
        paypal: any;
    }
}

// Load Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51Pm9ZFB1aBR5lScuoE0ajoWXmOiml4IkFDN29nFBGxBhejgRY28kg8BnoLfFoTISOGHt0qAUJmq8P8PIpzTy6KII00PJwZ2A14');

const PricingPlans: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [billingCycle, setBillingCycle] = useState('yearly');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Card');
    const [prices, setPrices] = useState({
        basic: 2999, // Default yearly price in cents
        business: 5999,
        enterprise: 9999
    });

    useEffect(() => {
        fetchPrices(billingCycle);
    }, [billingCycle]);

    const fetchPrices = async (cycle: string) => {
        try {
            const response = await axios.post('http://localhost:3001/get-pricing', { billingCycle: cycle });
            setPrices({
                basic: response.data.basic,
                business: response.data.business,
                enterprise: response.data.enterprise,
            });
        } catch (error) {
            toast.error('Failed to fetch pricing.');
        }
    };

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
                    <h4>${(prices.basic / 100).toFixed(2)}<span>/mo</span></h4>
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
                    <p>For Medium team needs</p>
                    <h4>${(prices.business / 100).toFixed(2)}<span>/mo</span></h4>
                    <ul>
                        <li>50 GB Disk Space</li>
                        <li>3 Year Support</li>
                        <li>Unlimited Queries</li>
                        <li>Free Custom Domain</li>
                    </ul>
                    <button onClick={openModal}>Buy Now</button>
                </div>
                <div className="plan enterprise">
                    <h3>Enterprise Plan</h3>
                    <p>For Large team needs</p>
                    <h4>${(prices.enterprise / 100).toFixed(2)}<span>/mo</span></h4>
                    <ul>
                        <li>100 GB Disk Space</li>
                        <li>5 Years Support</li>
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
                        <StripePaymentForm closeModal={closeModal} price={prices.basic} />
                    </Elements>
                )}
                {selectedPaymentMethod === 'PayPal' && (
                    <PayPalPayment closeModal={closeModal} />
                )}
            </Modal>
            <ToastContainer />
        </div>
    );
};

const StripePaymentForm: React.FC<{ closeModal: () => void, price: number }> = ({ closeModal, price }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const currency = 'eur'; // Set your currency

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            toast.error('Payment system not ready.');
            return; // Stripe.js has not yet loaded.
        }

        const cardElement = elements.getElement(CardElement);
        const cardholderName = (event.target as HTMLFormElement).cardholderName.value;
        const expirationDate = (event.target as HTMLFormElement).expirationDate.value;
        const cvv = (event.target as HTMLFormElement).cvv.value;

        if (!cardElement || !cardholderName || !expirationDate || !cvv) {
            toast.error('All fields are required.');
            return;
        }

        setIsLoading(true); // Start loading

        try {
            const { data: clientSecret } = await axios.post('http://localhost:3001/create-payment-intent', {
                amount: price, // Adjust the amount as necessary
                currency: currency
            });

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement!,
                    billing_details: { name: cardholderName },
                },
            });

            if (error) {
                toast.error(`Payment failed: ${error.message}`);
                return;
            }

            if (paymentIntent?.status === 'succeeded') {
                toast.success('Payment successful!');
                closeModal();
                return;
            }
        } catch (error) {
            toast.error('An error occurred while processing the payment.');
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Card number</label>
                <CardElement />
            </div>
            <div className="input-group">
                <label>Name on card</label>
                <input type="text" name="cardholderName" placeholder="Cardholder name" />
            </div>
            <div className="input-group" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: '1', marginRight: '10px' }}>
                    <label>Expiration date</label>
                    <input type="text" name="expirationDate" placeholder="MM/YY" />
                </div>
                <div style={{ flex: '1' }}>
                    <label>Security code</label>
                    <input type="text" name="cvv" placeholder="CVV" />
                </div>
            </div>
            <button className='pay-now' type="submit" disabled={!stripe || isLoading}>Pay {(price / 100).toFixed(2)} {currency.toUpperCase()}</button>
        </form>
    );
};

const PayPalPayment: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
    const [paypalLoaded, setPaypalLoaded] = useState(false);

    useEffect(() => {
        const loadPaypalScript = async () => {
            try {
                // Fetch the PayPal Client ID from your backend
                const response = await axios.get('http://localhost:3001/paypal-client-id');
                const clientId = response.data.clientId;

                // Create script element for PayPal SDK
                const script = document.createElement('script');
                script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
                script.async = true;

                // Append the script to the body
                document.body.appendChild(script);

                // Set the state when the script is loaded
                script.onload = () => {
                    setPaypalLoaded(true);
                };
            } catch (error) {
                console.error('Failed to load PayPal SDK:', error);
            }
        };

        loadPaypalScript();
    }, []);

    useEffect(() => {
        if (paypalLoaded && window.paypal) {
            window.paypal.Buttons({
                createOrder: async () => {
                    try {
                        const response = await axios.post('http://localhost:3001/create-paypal-order');
                        return response.data.id;
                    } catch (error) {
                        console.error('Failed to create PayPal order:', error);
                        throw error;
                    }
                },
                onApprove: async (data: any) => {
                    try {
                        const response = await axios.post('http://localhost:3001/capture-paypal-order', {
                            orderId: data.orderID
                        });
                        console.log('Payment captured:', response.data);
                        closeModal();

                        return response.data;
                    } catch (error) {
                        console.error('Payment capture failed:', error);
                        throw error;
                    }
                }
            }).render('#paypal-button-container');
        }
    }, [paypalLoaded, closeModal]);

    return <div id="paypal-button-container"></div>;
};

export default PricingPlans;
