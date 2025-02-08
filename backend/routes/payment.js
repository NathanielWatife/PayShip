const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Package = require('../models/Package');
const axios = require('axios');
const crypto = require('crypto');


const router = express.Router();

const CRYPTOMUS_API_KEY = process.env.CRYPTOMUS_API_KEY;
const MERCHANT_UUID = process.env.CRYPTOMUS_MERCHANT_UUID;
const CALLBACK_SECRET = process.env.CRYPTOMUS_CALLBACK_SECRET;


const BASE_URL = 'https://api.cryptomus.com/v1';

/**
 * @route POST /api/payment/create
 * @desc Initiate a Cryptomus payment
 * @access Private (Authenticated Users)
 */
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { packageId } = req.body;
        const user = req.user;

        // Fetch package details
        const package = await Package.findOne({ packageId, userId: user.id });
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }

        const paymentData = {
            merchant: MERCHANT_UUID,
            amount: package.price.toFixed(2), // Ensure it's in decimal format
            currency: 'USD', // Adjust currency if needed
            order_id: package.packageId, // Use packageId as the transaction reference
            url_return: `${process.env.FRONTEND_URL}/payment-success.html`, // Redirect after payment
            url_callback: `${process.env.BACKEND_URL}/api/payment/callback`, // Webhook URL
        };

        // Generate HMAC signature
        const signature = crypto
            .createHmac('sha256', CRYPTOMUS_API_KEY)
            .update(JSON.stringify(paymentData))
            .digest('hex');

        // Make API request to Cryptomus
        const response = await axios.post(`${BASE_URL}/payment`, paymentData, {
            headers: {
                'Content-Type': 'application/json',
                'merchant': MERCHANT_UUID,
                'sign': signature,
            },
        });

        // If successful, return payment URL
        if (response.data.result) {
            return res.json({
                message: 'Cryptomus payment initiated successfully.',
                payment_url: response.data.result.url,
            });
        }

        return res.status(400).json({ message: 'Failed to initiate payment.' });

    } catch (err) {
        console.error('Error initiating Cryptomus payment:', err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

/**
 * @route POST /api/payment/callback
 * @desc Handle Cryptomus payment callbacks
 * @access Public (Webhook)
 */
router.post('/callback', async (req, res) => {
    try {
        const callbackData = req.body;
        const providedSignature = req.headers['sign']; // Cryptomus provides this

        // Verify the callback signature
        const generatedSignature = crypto
            .createHmac('sha256', CRYPTOMUS_CALLBACK_SECRET)
            .update(JSON.stringify(callbackData))
            .digest('hex');

        if (providedSignature !== generatedSignature) {
            return res.status(403).json({ message: 'Invalid callback signature' });
        }

        const { order_id, status } = callbackData;

        // Fetch package
        const package = await Package.findOne({ packageId: order_id });
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Update payment status based on Cryptomus response
        if (status === 'paid') {
            package.payment.status = 'Paid';
            package.payment.paymentDate = new Date();
            await package.save();
            console.log(`Payment successful for Package: ${package.packageId}`);
        } else if (status === 'failed') {
            package.payment.status = 'Failed';
            await package.save();
            console.log(`Payment failed for Package: ${package.packageId}`);
        }

        return res.status(200).json({ message: 'Payment callback processed successfully' });

    } catch (err) {
        console.error('Error processing Cryptomus callback:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
