import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, IndianRupee, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: bookings = [], isLoading } = useBookings();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">My Bookings</h1>
            <p className="text-muted-foreground">Manage and track your bike rentals</p>
          </div>
          <Button onClick={() => navigate('/')} className="bg-gradient-primary">
            Book New Ride
          </Button>
        </div>

        {bookings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🏍️</div>
              <h3 className="text-2xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">Start your adventure by booking your first bike!</p>
              <Button onClick={() => navigate('/')} className="bg-gradient-primary">
                Browse Bikes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.bikes?.image_url}
                        alt={booking.bikes?.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <CardTitle className="text-xl">{booking.bikes?.name}</CardTitle>
                        <p className="text-muted-foreground">{booking.bikes?.brand} {booking.bikes?.model}</p>
                        <Badge className={`${getStatusColor(booking.status)} text-white mt-2`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">₹{booking.total_amount}</div>
                      <p className="text-sm text-muted-foreground">{booking.total_hours} hours</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-medium">
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
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p className="font-medium">
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
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup Location</p>
                        <p className="font-medium">{booking.pickup_location}</p>
                      </div>
                    </div>
                  </div>

                  {booking.special_instructions && (
                    <div className="mt-4 p-3 bg-accent/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Special Instructions</p>
                      <p className="text-sm">{booking.special_instructions}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-muted-foreground">
                      Booked on {new Date(booking.created_at).toLocaleDateString('en-IN')}
                    </p>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          Modify
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;