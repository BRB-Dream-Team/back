const axios = require('axios');

class PaycomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

class Paycom {
  constructor(config) {
    this.config = config;
    this.axios = axios.create({
      baseURL: 'https://checkout.paycom.uz',
      headers: {
        'X-Auth': Buffer.from(this.config.paycomKey + ':').toString('base64'),
        'Content-Type': 'application/json',
      },
    });
  }

  async createTransaction(amount, orderId) {
    try {
      const response = await this.axios.post('', {
        method: 'receipts.create',
        params: {
          amount: amount * 100, // Convert to tiyin
          account: {
            order_id: orderId,
          },
        },
      });

      if (response.data.error) {
        throw new PaycomError(response.data.error.code, response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      if (error instanceof PaycomError) {
        throw error;
      }
      throw new PaycomError(-32400, 'System Error');
    }
  }

  async checkTransaction(transactionId) {
    try {
      const response = await this.axios.post('', {
        method: 'receipts.check',
        params: {
          id: transactionId,
        },
      });

      if (response.data.error) {
        throw new PaycomError(response.data.error.code, response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      if (error instanceof PaycomError) {
        throw error;
      }
      throw new PaycomError(-32400, 'System Error');
    }
  }

  generatePaymentUrl(transactionId) {
    return `https://checkout.paycom.uz/${transactionId}`;
  }

  verifyWebhookSignature(req) {
    const receivedHash = req.headers['x-auth'];
    const calculatedHash = Buffer.from(this.config.paycomKey + ':').toString('base64');
    return receivedHash === calculatedHash;
  }

  handleWebhook(req, res) {
    if (!this.verifyWebhookSignature(req)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { method, params } = req.body;

    switch (method) {
      case 'receipts.pay':
        // Handle successful payment
        // Update your database, send confirmation email, etc.
        return res.json({ result: { success: true } });

      case 'receipts.cancel':
        // Handle payment cancellation
        // Update your database, etc.
        return res.json({ result: { success: true } });

      default:
        return res.status(400).json({ error: 'Unknown method' });
    }
  }
}

module.exports = Paycom;