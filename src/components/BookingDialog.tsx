import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCreateBooking, CreateBookingData } from '@/hooks/useBookings';
import { Bike } from '@/hooks/useBikes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Clock, CreditCard } from 'lucide-react';

interface BookingDialogProps {
  bike: Bike;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingDialog = ({ bike, open, onOpenChange }: BookingDialogProps) => {
  const { user } = useAuth();
  const createBookingMutation = useCreateBooking();
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    pickup_location: bike.location,
    drop_location: '',
    special_instructions: '',
  });

  const calculateTotal = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const hours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    const days = Math.ceil(hours / 24);
    
    return days * bike.price_per_day;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      onOpenChange(false);
      return;
    }

    const bookingData: CreateBookingData = {
      bike_id: bike.id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      pickup_location: formData.pickup_location,
      drop_location: formData.drop_location || undefined,
      special_instructions: formData.special_instructions || undefined,
    };

    createBookingMutation.mutate(bookingData, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({
          start_date: '',
          end_date: '',
          pickup_location: bike.location,
          drop_location: '',
          special_instructions: '',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book {bike.name}
          </DialogTitle>
          <DialogDescription>
            Fill in the details to book this bike for your ride.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bike Info */}
          <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
            <img
              src={bike.image_url}
              alt={bike.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-semibold">{bike.name}</h4>
              <p className="text-sm text-muted-foreground">{bike.model}</p>
              <p className="text-lg font-bold text-primary">₹{bike.price_per_day}/day</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  min={formData.start_date || new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup_location">Pickup Location</Label>
              <Input
                id="pickup_location"
                value={formData.pickup_location}
                onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                placeholder="Enter pickup location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="drop_location">Drop Location (Optional)</Label>
              <Input
                id="drop_location"
                value={formData.drop_location}
                onChange={(e) => setFormData({ ...formData, drop_location: e.target.value })}
                placeholder="Same as pickup if empty"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="special_instructions">Special Instructions (Optional)</Label>
              <Textarea
                id="special_instructions"
                value={formData.special_instructions}
                onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                placeholder="Any special requests or instructions..."
                rows={3}
              />
            </div>

            {formData.start_date && formData.end_date && (
              <div className="bg-gradient-primary/10 p-4 rounded-lg border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total Amount:</span>
                  <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    ₹{calculateTotal()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBookingMutation.isPending}
                className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;