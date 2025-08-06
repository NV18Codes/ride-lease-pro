import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Shield, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-hero text-primary-foreground py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight">
                Ride the
                <span className="block text-primary-glow">
                  Freedom
                </span>
              </h1>
              <p className="text-xl text-primary-foreground/90 leading-relaxed">
                Discover the joy of riding with our premium bike rental service. 
                Explore cities, mountains, and scenic routes with top-quality bikes 
                available 24/7.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-4"
              >
                Book Your Ride
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-4"
              >
                Explore Bikes
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm opacity-90">Happy Riders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">25+</div>
                <div className="text-sm opacity-90">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm opacity-90">Bikes</div>
              </div>
            </div>
          </div>

          {/* Hero Features */}
          <div className="space-y-6">
            <div className="grid gap-4">
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Multiple Locations</h3>
                    <p className="text-primary-foreground/80">
                      Pick up and drop off at 100+ convenient locations
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">24/7 Available</h3>
                    <p className="text-primary-foreground/80">
                      Book anytime, anywhere with instant confirmation
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Fully Insured</h3>
                    <p className="text-primary-foreground/80">
                      Comprehensive insurance and 24/7 roadside assistance
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Premium Quality</h3>
                    <p className="text-primary-foreground/80">
                      Well-maintained bikes with regular safety checks
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;