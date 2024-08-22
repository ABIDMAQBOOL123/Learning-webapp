const express = require('express');
const { createPaymentIntent, handleWebhook } = require('../../services/stripeService');
const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await createPaymentIntent(amount);
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
