# Razorpay Integration Setup Guide

## Overview
This guide will help you set up Razorpay payment gateway integration for the RideLease Pro bike rental application.

## Prerequisites
- Razorpay account (sign up at [razorpay.com](https://razorpay.com))
- Node.js and npm/yarn installed
- Basic understanding of React and TypeScript

## Step 1: Razorpay Account Setup

### 1.1 Create Razorpay Account
1. Go to [razorpay.com](https://razorpay.com)
2. Click "Sign Up" and create your account
3. Complete email verification

### 1.2 Get API Keys
1. Login to your Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Generate a new key pair
4. Copy both **Key ID** and **Key Secret**

**Important:** 
- Use **Test Mode** keys for development
- Use **Live Mode** keys for production
- Never commit API keys to version control

## Step 2: Environment Configuration

### 2.1 Create Environment File
Create a `.env.local` file in your project root:

```bash
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_GcDzPwQK0veSM9
VITE_RAZORPAY_KEY_SECRET=VkTuJp7eIpzdbMUm8BnYYX7Y

# Backend API (if you have one)
VITE_API_BASE_URL=http://localhost:3000/api
```

**Note:** Your test keys are already configured in the PaymentDialog component as a fallback, but it's recommended to use environment variables for better security.

### 2.2 Update PaymentDialog Component
The component is already configured to use environment variables. If you want to use your own keys, update the fallback in `src/components/PaymentDialog.tsx`:

```typescript
// The component now uses:
key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_GcDzPwQK0veSM9',
```

## Step 3: Backend Integration (Optional but Recommended)

For production applications, you should create orders on your backend server to ensure security.

### 3.1 Create Order API Endpoint
```typescript
// Example backend endpoint (Node.js/Express)
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      notes
    };
    
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3.2 Update Frontend to Use Backend
```typescript
// In PaymentDialog.tsx, replace the mock order creation with:
const response = await fetch('/api/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(orderData),
});

const order = await response.json();
```

## Step 4: Test Mode Configuration

### 4.1 Test Card Details
Use these test cards for testing:

**Success Cards:**
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

**Failure Cards:**
- Card Number: `4000 0000 0000 0002`
- Expiry: Any future date
- CVV: Any 3 digits

### 4.2 Test UPI IDs
- Success: `success@razorpay`
- Failure: `failure@razorpay`

### 4.3 Test Net Banking
- Success: `HDFC`
- Failure: `ICICI`

## Step 5: Production Deployment

### 5.1 Switch to Live Keys
1. Update environment variables with live keys
2. Ensure HTTPS is enabled
3. Update webhook URLs in Razorpay dashboard

### 5.2 Webhook Configuration
Set up webhooks for payment status updates:

```typescript
// Webhook endpoint example
app.post('/api/webhook', async (req, res) => {
  const secret = process.env.WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  
  try {
    const event = razorpay.webhooks.construct(
      req.body,
      signature,
      secret
    );
    
    switch (event.event) {
      case 'payment.captured':
        // Handle successful payment
        break;
      case 'payment.failed':
        // Handle failed payment
        break;
    }
    
    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});
```

## Step 6: Security Best Practices

### 6.1 Never Expose Secret Keys
- Keep `Key Secret` only on your backend
- Frontend should only use `Key ID`
- Use environment variables for configuration

### 6.2 Validate Payments
- Always verify payment signatures
- Check payment status on your backend
- Implement proper error handling

### 6.3 Rate Limiting
- Implement rate limiting on payment endpoints
- Monitor for suspicious activity
- Use CAPTCHA for repeated attempts

## Step 7: Testing Checklist

- [x] Test mode keys are configured
- [ ] Payment flow completes successfully
- [ ] Error handling works for failed payments
- [ ] Webhooks are receiving events
- [ ] Payment status updates correctly
- [ ] Mobile responsiveness works
- [ ] Different payment methods work

## Step 8: Common Issues & Solutions

### 8.1 Payment Not Processing
- Check if Razorpay script is loaded
- Verify API keys are correct
- Check browser console for errors

### 8.2 Order Creation Fails
- Verify amount is in paise (multiply by 100)
- Check if currency is supported
- Ensure receipt ID is unique

### 8.3 Webhook Not Working
- Verify webhook URL is accessible
- Check webhook secret configuration
- Monitor webhook logs in Razorpay dashboard

## Step 9: Monitoring & Analytics

### 9.1 Razorpay Dashboard
- Monitor payment success rates
- Track failed payment reasons
- Analyze payment method preferences

### 9.2 Application Logs
- Log all payment attempts
- Track payment status changes
- Monitor for errors and exceptions

## Step 10: Support & Resources

### 10.1 Official Documentation
- [Razorpay Docs](https://razorpay.com/docs/)
- [API Reference](https://razorpay.com/docs/api/)
- [Webhook Guide](https://razorpay.com/docs/webhooks/)

### 10.2 Community Support
- [Razorpay Community](https://razorpay.com/community/)
- [GitHub Issues](https://github.com/razorpay/razorpay-node/issues)

### 10.3 Contact Support
- Email: support@razorpay.com
- Phone: +91-80-4120-9000

## Conclusion

This setup guide covers the essential steps to integrate Razorpay into your RideLease Pro application. Remember to:

1. Start with test mode for development
2. Implement proper security measures
3. Test thoroughly before going live
4. Monitor and maintain the integration
5. Keep up with Razorpay updates and best practices

For any specific issues or questions, refer to the official Razorpay documentation or contact their support team.
