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
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, MapPin, Clock, CreditCard, Shield, FileText, ExternalLink } from 'lucide-react';
import { useBikeAvailability } from '@/hooks/useBikeAvailability';
import VerificationDialog from './VerificationDialog';
import { useEffect } from 'react';

interface BookingDialogProps {
  bike: Bike;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingDialog = ({ bike, open, onOpenChange }: BookingDialogProps) => {
  const { user } = useAuth();
  const createBookingMutation = useCreateBooking();
  const { data: availability } = useBikeAvailability(bike.id);
  const [showVerification, setShowVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
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

  const validateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    // Restrict to 7AM-7PM (19:00) for all dates
    return hours >= 7 && hours < 19; // 7AM to 7PM (19:00)
  };

  const getMinDateTime = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const minTime = new Date(today.getTime() + 7 * 60 * 60 * 1000); // 7AM today
    return minTime > now ? minTime.toISOString().slice(0, 16) : now.toISOString().slice(0, 16);
  };

  const getMaxDateTime = () => {
    // Allow booking up to 1 month in the future
    const now = new Date();
    const maxDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const maxTime = new Date(maxDate.getTime() + 19 * 60 * 60 * 1000); // 7PM on max date
    return maxTime.toISOString().slice(0, 16);
  };

  const getMinEndDateTime = () => {
    if (!formData.start_date) return getMinDateTime();
    const startDate = new Date(formData.start_date);
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    
    // If start date is today, minimum end time is 7AM on start day
    // If start date is in the future, minimum end time is 7AM on start day
    const minTime = new Date(startDay.getTime() + 7 * 60 * 60 * 1000); // 7AM on start day
    return minTime.toISOString().slice(0, 16);
  };

  const getMaxEndDateTime = () => {
    if (!formData.start_date) return getMaxDateTime();
    // Allow end date to be up to 1 month from start date, but still restrict time to 7PM
    const startDate = new Date(formData.start_date);
    const maxEndDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
    const maxTime = new Date(maxEndDate.getTime() + 19 * 60 * 60 * 1000); // 7PM on max end date
    return maxTime.toISOString().slice(0, 16);
  };

  // Memoize the min/max values to prevent recalculation on every render
  const minDateTime = getMinDateTime();
  const maxDateTime = getMaxDateTime();
  const minEndDateTime = getMinEndDateTime();
  const maxEndDateTime = getMaxEndDateTime();

  // Update end date constraints when start date changes
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      // If end date is before start date, clear it
      if (endDate < startDate) {
        setFormData(prev => ({ ...prev, end_date: '' }));
      }
    }
  }, [formData.start_date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      onOpenChange(false);
      return;
    }

    // Check if verification is required
    if (!isVerified) {
      setShowVerification(true);
      return;
    }

    // Check if terms are accepted
    if (!termsAccepted) {
      alert('Please accept the Terms and Conditions to proceed with booking.');
      return;
    }

    // Check if bike is available
    if (!availability?.isAvailable) {
      alert('This bike is currently booked and not available for the selected time.');
      return;
    }

    // Validate pickup and drop times (7AM to 7PM)
    if (!validateTime(formData.start_date)) {
      alert('Pickup time must be between 7:00 AM and 7:00 PM.');
      return;
    }

    if (!validateTime(formData.end_date)) {
      alert('Drop time must be between 7:00 AM and 7:00 PM.');
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
        setIsVerified(false);
        setTermsAccepted(false);
      },
    });
  };

  const handleVerificationComplete = (verified: boolean) => {
    setIsVerified(verified);
    setShowVerification(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl font-display font-bold">
            <div className="p-1.5 sm:p-2 bg-gradient-primary rounded-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
            </div>
            <span className="truncate">Book {bike.name}</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Fill in the details to book this amazing bike for your adventure ride.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bike Availability Warning */}
          {!availability?.isAvailable && (
            <div className="p-4 bg-bike-coral/10 rounded-xl border border-bike-coral/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-bike-coral/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-bike-coral" />
                </div>
                <div>
                  <p className="font-semibold text-bike-coral">Bike Currently Booked</p>
                  <p className="text-sm text-muted-foreground">
                    This bike is not available for new bookings at the moment.
                    {availability?.nextAvailableDate && (
                      <span> Next available: {new Date(availability.nextAvailableDate).toLocaleString()}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Bike Info */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-card rounded-2xl border border-border/50">
            <img
              src={bike.image_url}
              alt={bike.name}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-lg"
            />
            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-display font-bold text-lg sm:text-xl text-foreground mb-1 sm:mb-2">{bike.name}</h4>
              <p className="text-muted-foreground text-sm sm:text-base mb-2">{bike.model}</p>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <div className="text-xl sm:text-2xl font-display font-black text-primary">₹{bike.price_per_day}/day</div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">{bike.rating}★</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enhanced Date Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <Label htmlFor="start_date" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Start Date & Time
                </Label>
                <p className="text-sm text-muted-foreground">Available: 7:00 AM - 7:00 PM (Book up to 1 month ahead)</p>
                {formData.start_date && !validateTime(formData.start_date) && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    ⚠️ Time must be between 7:00 AM and 7:00 PM (19:00)
                  </p>
                )}
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => {
                    setFormData({ ...formData, start_date: e.target.value });
                  }}
                  min={minDateTime}
                  max={maxDateTime}
                  required
                  className="h-12 text-base border-2 border-border focus:border-primary transition-all duration-300"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="end_date" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  End Date & Time
                </Label>
                <p className="text-sm text-muted-foreground">Available: 7:00 AM - 7:00 PM (Book up to 1 month ahead)</p>
                {formData.end_date && !validateTime(formData.end_date) && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    ⚠️ Time must be between 7:00 AM and 7:00 PM (19:00)
                  </p>
                )}
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => {
                    const newEndDate = e.target.value;
                    setFormData({ ...formData, end_date: newEndDate });
                  }}
                  min={minEndDateTime}
                  max={maxEndDateTime}
                  required
                  className="h-12 text-base border-2 border-border focus:border-primary transition-all duration-300"
                />
              </div>
            </div>

            {/* Enhanced Location Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

            {/* Verification Status */}
            {isVerified && (
              <div className="bg-bike-seafoam/10 p-4 rounded-xl border border-bike-seafoam/20">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-bike-seafoam" />
                  <div>
                    <p className="font-semibold text-bike-seafoam">Documents Verified ✓</p>
                    <p className="text-sm text-muted-foreground">You're ready to proceed with booking</p>
                  </div>
                </div>
              </div>
            )}

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

            {/* Terms and Conditions */}
            {isVerified && formData.start_date && formData.end_date && (
              <div className="bg-bike-light/50 p-4 rounded-xl border border-bike-sand/20">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-sm font-medium text-foreground cursor-pointer">
                      I agree to the{' '}
                      <a
                        href="/Amelie Bike Rental T&C.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bike-primary hover:text-bike-primary/80 underline inline-flex items-center gap-1"
                      >
                        Terms and Conditions
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {' '}and understand the rental policies, safety requirements, and liability terms.
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      By checking this box, you confirm that you have read and agree to all terms outlined in the document.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-11 sm:h-12 text-sm sm:text-base font-semibold border-2 border-border hover:border-destructive hover:text-destructive transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBookingMutation.isPending || (isVerified && !termsAccepted)}
                className="flex-1 h-11 sm:h-12 text-sm sm:text-base font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Creating Booking...
                  </>
                ) : isVerified ? (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Confirm & Proceed to Payment
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Verify Documents & Continue
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
      
      {/* Verification Dialog */}
      <VerificationDialog
        open={showVerification}
        onOpenChange={setShowVerification}
        onVerificationComplete={handleVerificationComplete}
      />
    </Dialog>
  );
};

export default BookingDialog;