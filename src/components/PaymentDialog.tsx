import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, Clock, IndianRupee, CreditCard, CheckCircle, Shield } from 'lucide-react';
import { Booking } from '@/hooks/useBookings';

interface PaymentDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: (updatedBooking: Booking) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentDialog({ 
  booking, 
  open, 
  onOpenChange, 
  onPaymentSuccess 
}: PaymentDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script with better error handling
    const loadRazorpayScript = async () => {
      try {
        // Check if already loaded
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        script.onload = () => {
          console.log('Razorpay script loaded successfully');
          setRazorpayLoaded(true);
        };
        
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          setRazorpayLoaded(false);
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error('Error loading Razorpay script:', error);
        setRazorpayLoaded(false);
      }
    };

    loadRazorpayScript();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded || !booking) return;

    setIsProcessing(true);
    const amountInPaise = Math.round(booking.total_amount * 100);

    try {
      console.log('Trying minimal Razorpay options:', {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_GcDzPwQK0veSM9',
        amount: amountInPaise,
        currency: 'INR',
        name: 'Bike Rental',
        description: 'Bike Rental',
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999'
        },
        notes: {
          booking_id: booking.id
        },
        theme: {
          color: '#3B82F6'
        },
        handler: function (response: any) {
          console.log('Payment successful:', response);
          handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      });

      const minimalOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_GcDzPwQK0veSM9',
        amount: amountInPaise,
        currency: 'INR',
        name: 'Bike Rental',
        description: 'Bike Rental',
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999'
        },
        notes: {
          booking_id: booking.id
        },
        theme: {
          color: '#3B82F6'
        },
        handler: function (response: any) {
          console.log('Payment successful:', response);
          handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(minimalOptions);

      // Add event handlers for better error handling
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setIsProcessing(false);
        
        // Check if it's a QR verification issue
        if (response.error.description && response.error.description.includes('QR')) {
          alert('QR code verification failed. Please use Test Mode instead.');
        } else {
          alert(`Payment failed: ${response.error.description || 'Unknown error'}`);
        }
      });

      razorpay.on('payment.success', function (response: any) {
        console.log('Payment success event:', response);
        handlePaymentSuccess(response);
      });

      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      setIsProcessing(false);
      alert('Error opening payment gateway. Please try again.');
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      console.log('Processing payment success:', response);
      setIsProcessing(true);

      // Update the booking with payment information
      const updatedBooking = {
        ...booking,
        payment_status: 'completed',
        payment_id: response.razorpay_payment_id,
        payment_method: 'razorpay',
        paid_at: new Date().toISOString(),
        status: 'confirmed'
      };

      // Call the payment success callback with updated data
      onPaymentSuccess(updatedBooking);
      
      // Close the dialog
      onOpenChange(false);
      
      // Show success message
      alert('Payment successful! Your booking has been confirmed.');
      
    } catch (error) {
      console.error('Error processing payment success:', error);
      alert('Payment successful but there was an error updating your booking. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestPayment = async () => {
    try {
      setIsProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock payment response
      const mockResponse = {
        razorpay_payment_id: `pay_test_${Date.now()}`,
        razorpay_order_id: `order_test_${Date.now()}`,
        razorpay_signature: 'test_signature'
      };

      // Process the test payment success
      await handlePaymentSuccess(mockResponse);
      
    } catch (error) {
      console.error('Test payment error:', error);
      setIsProcessing(false);
      alert('Test payment failed. Please try again.');
    }
  };

  // Don't render if no booking is selected
  if (!booking) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-display font-bold">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            Complete Payment
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            Complete your payment to confirm the booking and start your adventure.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enhanced Booking Summary */}
          <Card className="border-2 border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-display font-bold">

                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-card rounded-xl">
                <img
                  src={booking.bikes?.image_url || '/placeholder.svg'}
                  alt={booking.bikes?.name || 'Bike'}
                  className="w-20 h-20 object-cover rounded-xl shadow-lg"
                />
                <div className="flex-1">
                  <h4 className="font-display font-bold text-xl text-foreground mb-2">
                    {booking.bikes?.name || 'Bike'}
                  </h4>
                  <p className="text-muted-foreground text-base mb-3">
                    {booking.bikes?.brand || 'Brand'} {booking.bikes?.model || 'Model'}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-gradient-to-r from-bike-seafoam to-bike-sand text-white px-3 py-1 font-semibold">
                      {booking.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-primary">

                      <span className="font-medium">Premium Ride</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold">{booking.total_hours} hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Pickup Location</p>
                    <p className="font-semibold">{booking.pickup_location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Payment Method Selection */}
          <Card className="border-2 border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-display font-bold">
                <Shield className="h-5 w-5 text-primary" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'razorpay' 
                      ? 'border-primary bg-gradient-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-lg">Razorpay</p>
                        <p className="text-muted-foreground">
                          {razorpayLoaded ? 'Cards, UPI, Net Banking & more' : 'Loading...'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!razorpayLoaded && (
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      )}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'razorpay' 
                          ? 'border-primary bg-primary' 
                          : 'border-border'
                      }`}>
                        {paymentMethod === 'razorpay' && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'test' 
                      ? 'border-primary bg-gradient-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setPaymentMethod('test')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-bike-purple to-bike-pink rounded-xl flex items-center justify-center">

                      </div>
                      <div>
                        <p className="font-display font-bold text-lg">Test Mode</p>
                        <p className="text-muted-foreground">Simulate payment for testing</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'test' 
                        ? 'border-primary bg-primary' 
                        : 'border-border'
                    }`}>
                      {paymentMethod === 'test' && (
                        <CheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Total Amount */}
          <div className="bg-gradient-primary/10 p-6 rounded-2xl border-2 border-primary/20">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-foreground text-lg">Total Amount:</span>
                <p className="text-sm text-muted-foreground">Including all taxes and insurance</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-display font-black bg-gradient-primary bg-clip-text text-transparent">
                  ₹{booking.total_amount}
                </span>
                <p className="text-sm text-muted-foreground">Secure payment processing</p>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 text-base font-semibold border-2 border-border hover:border-destructive hover:text-destructive transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={paymentMethod === 'razorpay' ? handleRazorpayPayment : handleTestPayment}
              disabled={isProcessing || (paymentMethod === 'razorpay' && !razorpayLoaded)}
              className="flex-1 h-12 text-base font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Processing...
                </>
              ) : paymentMethod === 'razorpay' && !razorpayLoaded ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Loading Razorpay...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay ₹{booking.total_amount}
                </>
              )}
            </Button>
          </div>

          {/* Fallback Message */}
          {!razorpayLoaded && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800 text-center">
                <strong>Note:</strong> Razorpay is loading. If it takes too long, you can use Test Mode for now.
              </p>
            </div>
          )}

          {/* Error Handling Tips */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800 text-center">
              <strong>Tip:</strong> If Razorpay doesn't work, use Test Mode to simulate the payment flow.
            </p>
          </div>

          {/* Razorpay Status */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-700 text-center">
              <strong>Razorpay Status:</strong> {razorpayLoaded ? '✅ Loaded' : '⏳ Loading...'}
            </p>
            {razorpayLoaded && (
              <p className="text-xs text-gray-600 text-center mt-1">
                Test Key: rzp_test_GcDzPwQK0veSM9
              </p>
            )}
          </div>

          {/* QR Code Help */}
          {razorpayLoaded && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-sm text-orange-800 text-center">
                <strong>Note:</strong> In test mode, QR codes may show verification errors. 
                If this happens, use Test Mode for a smooth experience.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
