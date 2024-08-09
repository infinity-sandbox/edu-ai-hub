import React from 'react';
import '../../styles/mainPageStyle/PaymentForm.css';

const PaymentForm: React.FC = () => {
    return (
        <div className="payment-form">
            <h3>Express Checkout</h3>
            <div className="express-checkout">
                <button className="apple-pay"> Pay</button>
                <button className="paypal">PayPal</button>
            </div>

            <h3>Payment</h3>
            <div className="payment-options">
                <button className="card active">Card</button>
                <button className="paypal">PayPal</button>
            </div>

            <form>
                <div className="form-group">
                    <label>Card number</label>
                    <input type="text" placeholder="1234 1234 1234 1234" />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Expiration</label>
                        <input type="text" placeholder="MM / YY" />
                    </div>
                    <div className="form-group">
                        <label>CVC</label>
                        <input type="text" placeholder="CVC" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Country</label>
                        <select>
                            <option>United States</option>
                            {/* Add more countries as needed */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>ZIP</label>
                        <input type="text" placeholder="12345" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;
