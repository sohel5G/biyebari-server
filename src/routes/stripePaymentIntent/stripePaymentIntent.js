
const express = require('express');
const { stripePaymentIntent } = require('../../controllers/stripePaymentIntent/stripePaymentIntent');
const router = express.Router();


router.post('/create-stripe-payment-intent', stripePaymentIntent)


module.exports = router;



