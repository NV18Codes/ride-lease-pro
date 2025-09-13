import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Calendar, MapPin, Clock, User, Phone, Mail } from 'lucide-react';
import PaymentDialog from '@/components/PaymentDialog';
import { useBikes } from '@/hooks/useBikes';
import { useCreateBooking } from '@/hooks/useBookings';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const createBookingMutation = useCreateBooking();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get booking data from URL parameters
  const bikeId = searchParams.get('bike_id');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const pickupLocation = searchParams.get('pickup_location');
  const dropLocation = searchParams.get('drop_location');
  const specialInstructions = searchParams.get('special_instructions');
  const extraHelmet = searchParams.get('extra_helmet') === 'true';
  const total = searchParams.get('total');

  const { data: bikes } = useBikes();

  useEffect(() => {
    if (bikeId && bikes) {
      const selectedBike = bikes.find(b => b.id === bikeId);
      setBike(selectedBike);
    }
    setLoading(false);
  }, [bikeId, bikes]);

  const handlePaymentSuccess = async (updatedBooking: any) => {
    try {
      // Create the booking in the database with confirmed status
      if (bikeId && startDate && endDate && pickupLocation && dropLocation && total) {
        const bookingData = {
          bike_id: bikeId,
          start_date: startDate,
          end_date: endDate,
          pickup_location: pickupLocation,
          drop_location: dropLocation,
          special_instructions: specialInstructions || '',
          extra_helmet: extraHelmet,
        };

        const newBooking = await createBookingMutation.mutateAsync(bookingData);
        
        // Update the booking status to confirmed after successful payment
        if (newBooking) {
          const { error: updateError } = await supabase
            .from('bookings')
            .update({ 
              status: 'confirmed',
              payment_status: 'completed',
              payment_id: updatedBooking.payment_id || 'test_payment_' + Date.now(),
              payment_method: updatedBooking.payment_method || 'razorpay',
              paid_at: new Date().toISOString()
            })
            .eq('id', newBooking.id);

          if (updateError) {
            console.error('Error updating booking status:', updateError);
          }
        }
        
        toast({
          title: 'Booking Confirmed!',
          description: 'Your bike booking has been successfully created and payment confirmed.',
        });

        // Redirect to bookings page
        navigate('/bookings');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Booking Error',
        description: 'Payment was successful but there was an error creating your booking. Please contact support.',
        variant: 'destructive',
      });
    }
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    const days = Math.ceil(hours / 24);
    
    if (days > 1) {
      return `${days} days`;
    } else if (hours > 1) {
      return `${hours} hours`;
    } else {
      return '1 hour';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Create booking parameters for redirect
    const bookingParams = new URLSearchParams();
    if (bikeId) bookingParams.set('bike_id', bikeId);
    if (startDate) bookingParams.set('start_date', startDate);
    if (endDate) bookingParams.set('end_date', endDate);
    if (pickupLocation) bookingParams.set('pickup_location', pickupLocation);
    if (dropLocation) bookingParams.set('drop_location', dropLocation);
    if (specialInstructions) bookingParams.set('special_instructions', specialInstructions);
    if (total) bookingParams.set('total', total);

    const authUrl = `/auth?redirect=/payment&${bookingParams.toString()}`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">Authentication Required</CardTitle>
            <p className="text-muted-foreground">Please sign in to proceed with payment</p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.href = authUrl}
              className="w-full bg-gradient-primary"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bike || !startDate || !endDate || !total) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">Invalid Booking</CardTitle>
            <p className="text-muted-foreground">Booking details are missing or invalid</p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-primary"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold">Complete Your Booking</h1>
            <p className="text-muted-foreground">Review your booking details and proceed to payment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bike Details */}
                <div className="flex items-center gap-4 p-4 bg-bike-light/50 rounded-lg">
                  <img 
                    src={bike.image_url || '/placeholder.svg'} 
                    alt={bike.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{bike.name}</h3>
                    <p className="text-muted-foreground">{bike.model}</p>
                    <Badge variant="secondary" className="mt-1">
                      {bike.type}
                    </Badge>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-bike-primary" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{calculateDuration()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-bike-primary" />
                    <div>
                      <p className="font-medium">Pickup Time</p>
                      <p className="text-sm text-muted-foreground">{formatDateTime(startDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-bike-primary" />
                    <div>
                      <p className="font-medium">Drop-off Time</p>
                      <p className="text-sm text-muted-foreground">{formatDateTime(endDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-bike-primary" />
                    <div>
                      <p className="font-medium">Pickup Location</p>
                      <p className="text-sm text-muted-foreground">{pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-bike-primary" />
                    <div>
                      <p className="font-medium">Drop-off Location</p>
                      <p className="text-sm text-muted-foreground">{dropLocation}</p>
                    </div>
                  </div>

                  {specialInstructions && (
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-bike-primary mt-1" />
                      <div>
                        <p className="font-medium">Special Instructions</p>
                        <p className="text-sm text-muted-foreground">{specialInstructions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-bike-primary" />
                  <div>
                    <p className="font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{user.user_metadata?.full_name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-bike-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rental Duration</span>
                    <span>{calculateDuration()}</span>
                  </div>
                  
                  {/* Base pricing */}
                  {(() => {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
                    
                    if (hours <= 24) {
                      return (
                        <div className="flex justify-between">
                          <span>Base Rate (24hrs or less)</span>
                          <span>₹500</span>
                        </div>
                      );
                    } else {
                      const additionalHours = hours - 24;
                      return (
                        <>
                          <div className="flex justify-between">
                            <span>Base Rate (24hrs)</span>
                            <span>₹500</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Additional Hours ({additionalHours}hrs × ₹22)</span>
                            <span>₹{additionalHours * 22}</span>
                          </div>
                        </>
                      );
                    }
                  })()}
                  
                  {/* Extra helmet */}
                  {extraHelmet && (
                    <div className="flex justify-between">
                      <span>Extra Helmet</span>
                      <span>₹50</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <Button 
                  onClick={() => setShowPaymentDialog(true)}
                  className="w-full bg-gradient-primary hover:shadow-glow h-12 text-lg font-semibold"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Payment
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Secure payment powered by Razorpay
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-bike-primary" />
                  <span className="text-sm">+91 78922 27029</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-bike-primary" />
                  <span className="text-sm">amilebikerental@gmail.com</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Dialog */}
        <PaymentDialog 
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          bike={bike}
          bookingData={{
            start_date: startDate,
            end_date: endDate,
            pickup_location: pickupLocation || '',
            drop_location: dropLocation || '',
            special_instructions: specialInstructions || '',
            extra_helmet: extraHelmet,
            total: parseFloat(total)
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default Payment;
