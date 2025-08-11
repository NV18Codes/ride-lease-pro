export interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        method: string;
        captured: boolean;
        description: string;
        email: string;
        contact: string;
        notes: Record<string, string>;
        created_at: number;
        updated_at: number;
      };
    };
    order?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        receipt: string;
        notes: Record<string, string>;
        created_at: number;
        updated_at: number;
      };
    };
    refund?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        payment_id: string;
        notes: Record<string, string>;
        created_at: number;
        updated_at: number;
      };
    };
  };
}

export interface PaymentStatus {
  paymentId: string;
  orderId?: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded' | 'cancelled';
  amount: number;
  currency: string;
  method?: string;
  timestamp: Date;
  notes?: Record<string, string>;
}

export function handleRazorpayWebhook(payload: RazorpayWebhookPayload): PaymentStatus | null {
  console.log('🔄 Razorpay Webhook Received:', payload.event);

  switch (payload.event) {
    case 'payment.captured':
      if (payload.payload.payment) {
        const payment = payload.payload.payment.entity;
        console.log('💰 Payment Captured:', payment.id, 'Amount:', payment.amount / 100);
        
        return {
          paymentId: payment.id,
          status: 'captured',
          amount: payment.amount / 100, // Convert from paise to rupees
          currency: payment.currency,
          method: payment.method,
          timestamp: new Date(payment.updated_at * 1000),
          notes: payment.notes
        };
      }
      break;

    case 'payment.failed':
      if (payload.payload.payment) {
        const payment = payload.payload.payment.entity;
        console.log('❌ Payment Failed:', payment.id, 'Reason:', payment.description);
        
        return {
          paymentId: payment.id,
          status: 'failed',
          amount: payment.amount / 100,
          currency: payment.currency,
          method: payment.method,
          timestamp: new Date(payment.updated_at * 1000),
          notes: payment.notes
        };
      }
      break;

    case 'order.paid':
      if (payload.payload.order) {
        const order = payload.payload.order.entity;
        console.log('✅ Order Paid:', order.id, 'Amount:', order.amount / 100);
        
        return {
          paymentId: order.id,
          orderId: order.id,
          status: 'captured',
          amount: order.amount / 100,
          currency: order.currency,
          timestamp: new Date(order.updated_at * 1000),
          notes: order.notes
        };
      }
      break;

    case 'payment.authorized':
      if (payload.payload.payment) {
        const payment = payload.payload.payment.entity;
        console.log('🔐 Payment Authorized:', payment.id);
        
        return {
          paymentId: payment.id,
          status: 'authorized',
          amount: payment.amount / 100,
          currency: payment.currency,
          method: payment.method,
          timestamp: new Date(payment.updated_at * 1000),
          notes: payment.notes
        };
      }
      break;

    case 'refund.processed':
      if (payload.payload.refund) {
        const refund = payload.payload.refund.entity;
        console.log('💸 Refund Processed:', refund.id, 'Amount:', refund.amount / 100);
        
        return {
          paymentId: refund.payment_id,
          status: 'refunded',
          amount: refund.amount / 100,
          currency: refund.currency,
          timestamp: new Date(refund.updated_at * 1000),
          notes: refund.notes
        };
      }
      break;

    default:
      console.log('📝 Unhandled webhook event:', payload.event);
      return null;
  }

  return null;
}

// Helper function to get payment status from Razorpay
export async function getPaymentStatus(paymentId: string, keyId: string, keySecret: string): Promise<PaymentStatus | null> {
  try {
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment status: ${response.status}`);
    }

    const payment = await response.json();
    
    return {
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount / 100,
      currency: payment.currency,
      method: payment.method,
      timestamp: new Date(payment.updated_at * 1000),
      notes: payment.notes
    };
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return null;
  }
}
