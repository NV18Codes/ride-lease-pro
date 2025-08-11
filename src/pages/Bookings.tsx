import { useState, useEffect } from 'react';
import { useBookings, useCancelBooking, useUpdateBooking, useSimulatePayment } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, MapPin, Clock, IndianRupee, MoreHorizontal, Edit, Trash2, CreditCard, CheckCircle, Sparkles, Zap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ModifyBookingDialog from '@/components/bookings/ModifyBookingDialog';
import CancelBookingDialog from '@/components/bookings/CancelBookingDialog';
import PaymentDialog from '@/components/PaymentDialog';
import { Booking } from '@/types/booking';

const BookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: bookings = [], isLoading, error, refetch } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const updateBookingMutation = useUpdateBooking();
  const cancelBooking = useCancelBooking();
  const simulatePayment = useSimulatePayment();

  // Move navigation logic to useEffect
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'completed':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleModifyBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowModifyDialog(true);
  };

  const handleCancelBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowCancelDialog(true);
  };

  const handlePayNow = (booking: any) => {
    if (!booking) {
      toast({
        title: 'Error',
        description: 'No booking selected for payment.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedBooking(booking);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = async (updatedBooking: Booking) => {
    try {
      console.log('Payment success, updating booking:', updatedBooking);
      
      // Update the booking in the database
      await updateBookingMutation.mutateAsync({
        id: updatedBooking.id,
        payment_status: 'completed',
        payment_id: updatedBooking.payment_id,
        payment_method: updatedBooking.payment_method || 'razorpay',
        paid_at: updatedBooking.paid_at,
        status: 'confirmed'
      });

      // Show success toast
      toast({
        title: "Payment Successful! 🎉",
        description: "Your booking has been confirmed and payment processed.",
        variant: "default",
      });

      // Refresh the bookings data
      refetch();
      
      // Reset selected booking
      setSelectedBooking(null);
      
    } catch (error) {
      console.error('Error updating booking after payment:', error);
      toast({
        title: "Payment Successful but Update Failed",
        description: "Payment was processed but there was an error updating your booking. Please contact support.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground font-medium">Loading your amazing bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h3 className="text-2xl font-display font-bold mb-4 text-destructive">Failed to load bookings</h3>
          <p className="text-lg text-muted-foreground mb-8">Something went wrong while loading your bookings.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-3 h-auto font-semibold"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-4xl font-display font-black text-foreground">My Bookings</h1>
              <Zap className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground">Manage and track your amazing bike rental adventures</p>
          </div>
          <Button onClick={() => navigate('/')} className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-3 h-auto font-semibold">
            <Sparkles className="h-5 w-5 mr-2" />
            Book New Ride
          </Button>
        </div>

        {bookings.length === 0 ? (
          <Card className="text-center py-16 border-0 shadow-soft">
            <CardContent>
              <div className="text-8xl mb-6">🏍️</div>
              <h3 className="text-3xl font-display font-bold mb-4">No bookings yet</h3>
              <p className="text-xl text-muted-foreground mb-8">Start your adventure by booking your first amazing bike!</p>
              <Button onClick={() => navigate('/')} className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-3 h-auto font-semibold">
                <Sparkles className="h-5 w-5 mr-2" />
                Browse Amazing Bikes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-soft transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {booking.bikes?.name || 'Bike'} - {booking.bikes?.brand} {booking.bikes?.model}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {/* Payment Status Badge */}
                      <Badge 
                        variant={booking.payment_status === 'completed' ? 'default' : 'secondary'}
                        className={`
                          ${booking.payment_status === 'completed' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }
                        `}
                      >
                        {booking.payment_status === 'completed' ? '✅ Paid' : '⏳ Payment Pending'}
                      </Badge>
                      
                      {/* Booking Status Badge */}
                      <Badge 
                        variant="outline"
                        className={`
                          ${booking.status === 'confirmed' 
                            ? 'bg-blue-100 text-blue-800 border-blue-200' 
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                          }
                        `}
                      >
                        {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-gradient-card rounded-xl border border-border/50">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Start Date</p>
                        <p className="font-semibold text-foreground">
                          {new Date(booking.start_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-card rounded-xl border border-border/50">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">End Date</p>
                        <p className="font-semibold text-foreground">
                          {new Date(booking.end_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-card rounded-xl border border-border/50">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Pickup Location</p>
                        <p className="font-semibold text-foreground">{booking.pickup_location}</p>
                      </div>
                    </div>
                  </div>

                  {booking.special_instructions && (
                    <div className="mb-6 p-4 bg-gradient-primary/10 rounded-xl border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-2 font-medium">Special Instructions</p>
                      <p className="text-foreground">{booking.special_instructions}</p>
                    </div>
                  )}

                  {/* Payment Information */}
                  {booking.payment_status === 'completed' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Payment Completed</span>
                      </div>
                      {booking.payment_id && (
                        <p className="text-xs text-green-600 mt-1">
                          Payment ID: {booking.payment_id}
                        </p>
                      )}
                      {booking.paid_at && (
                        <p className="text-xs text-green-600">
                          Paid on: {new Date(booking.paid_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {booking.payment_status === 'pending' ? (
                      <Button
                        onClick={() => handlePayNow(booking)}
                        className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Now
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="flex-1"
                        disabled
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Payment Complete
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModifyBooking(booking)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
                
              </Card>
            ))}
          </div>
        )}

        {/* Payment Dialog */}
        {selectedBooking && (
          <PaymentDialog
            booking={selectedBooking}
            open={showPaymentDialog}
            onOpenChange={(open) => {
              setShowPaymentDialog(open);
              if (!open) {
                setSelectedBooking(null);
              }
            }}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        <ModifyBookingDialog
          open={showModifyDialog}
          onOpenChange={setShowModifyDialog}
          booking={selectedBooking}
          onSubmit={(values) => {
            updateBookingMutation.mutate(values);
            setShowModifyDialog(false);
          }}
        />

        <CancelBookingDialog
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          booking={selectedBooking}
          onConfirm={() => {
            if (selectedBooking) {
              cancelBooking.mutate(selectedBooking.id);
            }
            setShowCancelDialog(false);
          }}
        />
      </div>
    </div>
  );
};

export default BookingsPage;