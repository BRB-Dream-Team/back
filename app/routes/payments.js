const express = require('express');
const router = express.Router();
const Paycom = require('../services/payment/payme'); // Assume this is the class we created earlier
const config = require('../services/payment/payme/config');

const paycom = new Paycom(config);

// Middleware to handle Paycom errors
const handlePaycomError = (error, req, res, next) => {
  if (error instanceof PaycomError) {
    return res.status(400).json({ error: error.message, code: error.code });
  }
  next(error);
};

// Route to create a new payment
router.post('/create-payment', async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;
    
    if (!amount || !orderId) {
      return res.status(400).json({ error: 'Amount and orderId are required' });
    }

    const transaction = await paycom.createTransaction(amount, orderId);
    const paymentUrl = paycom.generatePaymentUrl(transaction.id);

    res.json({
      success: true,
      transactionId: transaction.id,
      paymentUrl: paymentUrl
    });
  } catch (error) {
    next(error);
  }
});

// Route to check payment status
router.get('/check-payment/:transactionId', async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    
    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const status = await paycom.checkTransaction(transactionId);

    res.json({
      success: true,
      status: status
    });
  } catch (error) {
    next(error);
  }
});

// Webhook route for Paycom callbacks
router.post('/webhook', (req, res) => {
  if (!paycom.verifyWebhookSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { method, params } = req.body;

  switch (method) {
    case 'receipts.pay':
      // Handle successful payment
      // Update your database, send confirmation email, etc.
      console.log('Payment successful:', params);
      return res.json({ result: { success: true } });

    case 'receipts.cancel':
      // Handle payment cancellation
      // Update your database, etc.
      console.log('Payment cancelled:', params);
      return res.json({ result: { success: true } });

    default:
      return res.status(400).json({ error: 'Unknown method' });
  }
});

// Use the error handling middleware
router.use(handlePaycomError);

module.exports = router;