const paypal = require('paypal-rest-sdk');

// Create a payment
exports.createPayment = (req, res) => {
    const { amount, currency } = req.body;

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Item",
                    "sku": "001",
                    "price": amount,
                    "currency": currency,
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": currency,
                "total": amount
            },
            "description": "This is the payment description."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.json({ approval_url: payment.links[i].href });
                }
            }
        }
    });
};

// Execute the payment
exports.executePayment = (req, res) => {
    const { paymentId, payerId } = req.body;

    const execute_payment_json = {
        "payer_id": payerId,
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.error(error.response);
            res.status(500).send(error);
        } else {
            res.json(payment);
        }
    });
};

// Cancel the payment
exports.cancelPayment = (req, res) => {
    res.send('Payment canceled');
};
