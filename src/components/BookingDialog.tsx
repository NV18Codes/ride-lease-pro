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
import { Calendar, MapPin, Clock, CreditCard, Sparkles, Zap } from 'lucide-react';

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
    pickup_location: 'Malpe, Udupi',
    drop_location: 'Malpe, Udupi',
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
          pickup_location: 'Malpe, Udupi',
          drop_location: 'Malpe, Udupi',
          special_instructions: '',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-display font-bold">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            Book {bike.name}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            Fill in the details to book this amazing bike for your adventure ride.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enhanced Bike Info */}
          <div className="flex items-center gap-4 p-6 bg-gradient-card rounded-2xl border border-border/50">
            <img
              src={bike.image_url}
              alt={bike.name}
              className="w-24 h-24 object-cover rounded-xl shadow-lg"
            />
            <div className="flex-1">
              <h4 className="font-display font-bold text-xl text-foreground mb-2">{bike.name}</h4>
              <p className="text-muted-foreground text-base mb-2">{bike.model}</p>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-display font-black text-primary">₹{bike.price_per_day}/day</div>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold text-foreground">{bike.rating}★</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enhanced Date Selection */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="start_date" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Start Date & Time
                </Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                  className="h-12 text-base border-2 border-border focus:border-primary transition-all duration-300"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="end_date" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  End Date & Time
                </Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  min={formData.start_date || new Date().toISOString().slice(0, 16)}
                  required
                  className="h-12 text-base border-2 border-border focus:border-primary transition-all duration-300"
                />
              </div>
            </div>

            {/* Enhanced Location Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="pickup_location" className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Pickup Location
                </Label>
                <Input
                  id="pickup_location"
                  value={formData.pickup_location}
                  disabled
                  className="h-12 text-base bg-muted border-2 border-border/50"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="drop_location" className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Drop Location
                </Label>
                <Input
                  id="drop_location"
                  value={formData.drop_location}
                  disabled
                  className="h-12 text-base bg-muted border-2 border-border/50"
                />
              </div>
            </div>

            {/* Enhanced Special Instructions */}
            <div className="space-y-3">
              <Label htmlFor="special_instructions" className="text-base font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Special Instructions (Optional)
              </Label>
              <Textarea
                id="special_instructions"
                value={formData.special_instructions}
                onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                placeholder="Any special requests or instructions for your ride..."
                rows={4}
                className="text-base border-2 border-border focus:border-primary transition-all duration-300 resize-none"
              />
            </div>

            {/* Enhanced Total Amount Display */}
            {formData.start_date && formData.end_date && (
              <div className="bg-gradient-primary/10 p-6 rounded-2xl border-2 border-primary/20">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-foreground text-lg">Total Amount:</span>
                    <p className="text-sm text-muted-foreground">Including all taxes and insurance</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-display font-black bg-gradient-primary bg-clip-text text-transparent">
                      ₹{calculateTotal()}
                    </span>
                    <p className="text-sm text-muted-foreground">Secure payment via Razorpay</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 text-base font-semibold border-2 border-border hover:border-destructive hover:text-destructive transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBookingMutation.isPending}
                className="flex-1 h-12 text-base font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Confirm & Proceed to Payment
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