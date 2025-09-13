import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Fuel, Users, MapPin, Clock, Calendar, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Bike } from "@/hooks/useBikes";
import { useBikeAvailability } from "@/hooks/useBikeAvailability";
import BookingDialog from "./BookingDialog";

interface BikeCardProps {
  bike: Bike;
}

const BikeCard = ({ bike }: BikeCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: availability, isLoading: availabilityLoading, refetch: refetchAvailability } = useBikeAvailability(bike.id);

  // Force refetch availability when component mounts to ensure fresh data
  useEffect(() => {
    refetchAvailability();
  }, [refetchAvailability]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowBookingDialog(true);
  };

  const formatNextAvailableDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      return `Available in ${diffDays} days`;
    } else if (diffHours > 1) {
      return `Available in ${diffHours} hours`;
    } else {
      return `Available soon`;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'scooter':
        return 'bg-gradient-to-r from-bike-sand to-bike-cream';
      case 'motorcycle':
        return 'bg-gradient-to-r from-bike-coral to-bike-sand';
      case 'sports':
        return 'bg-gradient-to-r from-bike-seafoam to-bike-cream';
      case 'cruiser':
        return 'bg-gradient-to-r from-bike-coral to-bike-seafoam';
      case 'electric':
        return 'bg-gradient-to-r from-bike-seafoam to-bike-sand';
      default:
        return 'bg-gradient-to-r from-bike-primary to-bike-secondary';
    }
  };

  return (
    <Card className="group hover:shadow-glow transition-all duration-500 hover:-translate-y-3 bg-gradient-card border-0 overflow-hidden animate-fade-in">
      <CardHeader className="p-0 relative">
        {/* Enhanced Image */}
        <div className="relative h-48 sm:h-56 bg-muted rounded-t-xl overflow-hidden">
          <img 
            src={bike.image_url} 
            alt={bike.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          
          {/* Enhanced Favorite Button */}
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          >
            <Heart 
              className={`h-5 w-5 transition-all duration-300 ${
                isFavorited 
                  ? 'fill-bike-coral text-bike-coral scale-110' 
                  : 'text-bike-gray hover:text-bike-coral'
              }`} 
            />
          </button>

          {/* Enhanced Availability Badge */}
          <div className="absolute top-4 left-4">
            <Badge 
              variant={availability?.isAvailable ? "default" : "secondary"}
              className={`${
                availability?.isAvailable 
                  ? "bg-gradient-to-r from-bike-seafoam to-bike-sand hover:from-bike-seafoam/80 hover:to-bike-sand/80 text-white shadow-lg font-semibold" 
                  : "bg-gradient-to-r from-bike-coral to-bike-gray text-white font-semibold"
              } transition-all duration-300 px-3 py-1`}
            >
              {availabilityLoading ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Loading...</span>
                </div>
              ) : availability?.isAvailable ? (
                "Available"
              ) : (
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Booked</span>
                </div>
              )}
            </Badge>
          </div>

          {/* Enhanced Type Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge 
              variant="outline" 
              className={`${getTypeColor(bike.type)} text-white border-0 shadow-lg font-semibold px-3 py-1`}
            >
              {bike.type}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Enhanced Header */}
        <div className="space-y-3 mb-4 sm:mb-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg sm:text-xl text-foreground leading-tight">
                {bike.name}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium">{bike.model}</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl font-display font-black text-primary">
                ₹{bike.price_per_day}
              </div>
              <div className="text-xs text-muted-foreground font-medium">per day</div>
            </div>
          </div>

          {/* Enhanced Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-bike-coral text-bike-coral" />
                <span className="font-bold text-lg">{bike.rating}</span>
              </div>
              <span className="text-muted-foreground text-sm font-medium">
                ({bike.total_ratings} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary">

              <span className="text-sm font-medium">Premium</span>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Info */}
        <div className="grid grid-cols-3 gap-4 mb-5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground bg-accent/30 p-2 rounded-lg">
            <Fuel className="h-4 w-4 text-primary" />
            <span className="font-medium">{bike.fuel_type}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-accent/30 p-2 rounded-lg">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">2 seater</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-accent/30 p-2 rounded-lg">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">{bike.location}</span>
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {(bike.features || []).slice(0, 3).map((feature, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-gradient-to-r from-bike-primary/10 to-bike-secondary/10 text-primary border border-primary/20 font-medium px-3 py-1"
              >
                {feature}
              </Badge>
            ))}
            {(bike.features || []).length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-bike-sand/10 to-bike-cream/10 text-bike-sand border border-bike-sand/20 font-medium px-3 py-1">
                +{(bike.features || []).length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Enhanced Description */}
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
          {bike.description}
        </p>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-2 hover:border-primary font-semibold text-xs sm:text-sm"
            onClick={handleBookNow}
          >
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Quick Book</span>
            <span className="sm:hidden">Quick</span>
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105 font-semibold text-xs sm:text-sm"
            disabled={!availability?.isAvailable}
            onClick={handleBookNow}
          >
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{availability?.isAvailable ? "Book Now" : "Booked"}</span>
            <span className="sm:hidden">{availability?.isAvailable ? "Book" : "Booked"}</span>
          </Button>
        </div>
        
        {/* Availability Information */}
        {!availability?.isAvailable && availability?.nextAvailableDate && (
          <div className="mt-3 p-3 bg-bike-coral/10 rounded-lg border border-bike-coral/20">
            <div className="flex items-center gap-2 text-bike-coral">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {formatNextAvailableDate(availability.nextAvailableDate)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Next available: {new Date(availability.nextAvailableDate).toLocaleString()}
            </p>
          </div>
        )}
        
        <BookingDialog
          bike={bike}
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
        />
      </CardContent>
    </Card>
  );
};

export default BikeCard;