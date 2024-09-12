module.exports = {
    // Your Paycom merchant ID
    merchantId: process.env.PAYCOM_MERCHANT_ID || 'your_merchant_id_here',
  
    // Your Paycom API key (cashier's key)
    paycomKey: process.env.PAYCOM_API_KEY || 'your_paycom_api_key_here',
  
    // Paycom API endpoint
    apiEndpoint: 'https://checkout.paycom.uz',
  
    // Test mode flag (set to true for sandbox testing)
    testMode: process.env.NODE_ENV !== 'production',
  
    // Callback URL for Paycom to send notifications (your webhook URL)
    callbackUrl: process.env.PAYCOM_CALLBACK_URL || 'https://your-domain.com/api/payments/payme-callback',
  
    // Minimum and maximum transaction amounts in UZS (adjust as needed)
    minAmount: 1000, // 1,000 UZS
    maxAmount: 10000000, // 10,000,000 UZS
  
    // Timeout for API requests in milliseconds
    timeout: 10000, // 10 seconds
  
    // Return URL after successful payment (optional)
    returnUrl: process.env.PAYCOM_RETURN_URL || 'https://your-domain.com/payment-success',
  
    // Custom headers for API requests (if required)
    customHeaders: {
      'X-Auth': process.env.PAYCOM_X_AUTH || 'your_x_auth_header_here'
    }
  };