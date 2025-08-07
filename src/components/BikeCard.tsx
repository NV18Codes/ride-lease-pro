import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Fuel, Users, MapPin, Clock, Calendar } from "lucide-react";
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

  return (
    <Card className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
      <CardHeader className="p-0 relative">
        {/* Image */}
        <div className="relative h-48 bg-muted rounded-t-lg overflow-hidden">
          <img 
            src={bike.image_url} 
            alt={bike.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>

          {/* Availability Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant={bike.status === 'available' ? "default" : "secondary"}
              className={bike.status === 'available' ? "bg-green-500 text-white" : ""}
            >
              {bike.status === 'available' ? "Available" : "Booked"}
            </Badge>
          </div>

          {/* Type Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
              {bike.type}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Header */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-heading font-semibold text-lg text-foreground">
                {bike.name}
              </h3>
              <p className="text-muted-foreground text-sm">{bike.model}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                ₹{bike.price_per_day}
              </div>
              <div className="text-xs text-muted-foreground">per day</div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{bike.rating}</span>
            </div>
            <span className="text-muted-foreground text-sm">
              ({bike.total_ratings} reviews)
            </span>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Fuel className="h-4 w-4" />
            <span>{bike.fuel_type}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>2 seater</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{bike.location}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {bike.features.slice(0, 3).map((feature, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-accent text-accent-foreground"
              >
                {feature}
              </Badge>
            ))}
            {bike.features.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{bike.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {bike.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleBookNow}
          >
            <Clock className="h-4 w-4 mr-2" />
            Quick Book
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-primary"
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