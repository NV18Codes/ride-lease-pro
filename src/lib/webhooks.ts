// Razorpay webhook handler for Vite + Supabase setup
// This will be used when you deploy to Vercel

export interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      order_id: string;
      method: string;
    };
    order: {
      id: string;
      amount: number;
      currency: string;
      status: string;
    };
  };
}

export const handleRazorpayWebhook = async (payload: RazorpayWebhookPayload) => {
  try {
    console.log('Razorpay webhook received:', payload);

    const { event, payload: eventPayload } = payload;

    switch (event) {
      case 'payment.captured':
        console.log('Payment captured:', eventPayload);
        // Here you would update your Supabase database
        // Update booking status to confirmed
        break;

      case 'payment.failed':
        console.log('Payment failed:', eventPayload);
        // Handle failed payment
        break;

      case 'order.paid':
        console.log('Order paid:', eventPayload);
        // Handle successful order
        break;

      default:
        console.log('Unhandled event:', event);
    }

    return { success: true, received: true };

  } catch (error) {
    console.error('Webhook processing error:', error);
    throw error;
  }
};

// For Vercel deployment, you'll need to create an API route
// Create a file at: api/webhooks/razorpay.js (or .ts)
// Example Vercel API route:
/*
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await handleRazorpayWebhook(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
*/
