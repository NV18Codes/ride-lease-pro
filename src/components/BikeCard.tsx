import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Fuel, Users, MapPin, Clock, Calendar, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Bike } from "@/hooks/useBikes";
import BookingDialog from "./BookingDialog";

interface BikeCardProps {
  bike: Bike;
}

const BikeCard = ({ bike }: BikeCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowBookingDialog(true);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'scooter':
        return 'bg-gradient-to-r from-bike-purple to-bike-pink';
      case 'motorcycle':
        return 'bg-gradient-to-r from-bike-orange to-bike-pink';
      case 'sports':
        return 'bg-gradient-to-r from-bike-teal to-bike-purple';
      case 'cruiser':
        return 'bg-gradient-to-r from-bike-orange to-bike-teal';
      case 'electric':
        return 'bg-gradient-to-r from-bike-teal to-bike-green';
      default:
        return 'bg-gradient-to-r from-bike-primary to-bike-secondary';
    }
  };

  return (
    <Card className="group hover:shadow-glow transition-all duration-500 hover:-translate-y-3 bg-gradient-card border-0 overflow-hidden animate-fade-in">
      <CardHeader className="p-0 relative">
        {/* Enhanced Image */}
        <div className="relative h-56 bg-muted rounded-t-xl overflow-hidden">
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
                  ? 'fill-red-500 text-red-500 scale-110' 
                  : 'text-gray-600 hover:text-red-500'
              }`} 
            />
          </button>

          {/* Enhanced Availability Badge */}
          <div className="absolute top-4 left-4">
            <Badge 
              variant={bike.status === 'available' ? "default" : "secondary"}
              className={`${
                bike.status === 'available' 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg font-semibold" 
                  : "bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold"
              } transition-all duration-300 px-3 py-1`}
            >
              {bike.status === 'available' ? "Available" : "Booked"}
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

      <CardContent className="p-6">
        {/* Enhanced Header */}
        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-display font-bold text-xl text-foreground leading-tight">
                {bike.name}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">{bike.model}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-black text-primary">
                ₹{bike.price_per_day}
              </div>
              <div className="text-xs text-muted-foreground font-medium">per day</div>
            </div>
          </div>

          {/* Enhanced Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">{bike.rating}</span>
              </div>
              <span className="text-muted-foreground text-sm font-medium">
                ({bike.total_ratings} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Sparkles className="h-4 w-4" />
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
            {bike.features.slice(0, 3).map((feature, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-gradient-to-r from-bike-primary/10 to-bike-secondary/10 text-primary border border-primary/20 font-medium px-3 py-1"
              >
                {feature}
              </Badge>
            ))}
            {bike.features.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-bike-purple/10 to-bike-pink/10 text-bike-purple border border-bike-purple/20 font-medium px-3 py-1">
                +{bike.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Enhanced Description */}
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
          {bike.description}
        </p>

        {/* Enhanced Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-2 hover:border-primary font-semibold"
            onClick={handleBookNow}
          >
            <Clock className="h-4 w-4 mr-2" />
            Quick Book
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105 font-semibold"
            disabled={bike.status !== 'available'}
            onClick={handleBookNow}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Now
          </Button>
        </div>
        
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