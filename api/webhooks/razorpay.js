// Vercel API route for Razorpay webhooks
// This file should be placed in the root of your project (not in src/)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { event, payload } = req.body;

    console.log('Razorpay webhook received:', { event, payload });

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        console.log('Payment captured:', payload);
        // Here you would update your Supabase database
        // Update booking status to confirmed
        // Example: await updateBookingStatus(payload.payment.order_id, 'confirmed');
        break;

      case 'payment.failed':
        console.log('Payment failed:', payload);
        // Handle failed payment
        // Example: await updateBookingStatus(payload.payment.order_id, 'failed');
        break;

      case 'order.paid':
        console.log('Order paid:', payload);
        // Handle successful order
        break;

      default:
        console.log('Unhandled event:', event);
    }

    // Return success to Razorpay
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
