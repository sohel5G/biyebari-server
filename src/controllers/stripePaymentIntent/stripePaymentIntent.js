
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST);

const stripePaymentIntent = async (req, res) => {
    try {
        const { price } = req.body;
        const amount = parseInt(price * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card']
        });

        res.send({
            clientSecret: paymentIntent.client_secret
        })

    } catch (err) {
        console.log(err)
    }

}


module.exports = { stripePaymentIntent };


