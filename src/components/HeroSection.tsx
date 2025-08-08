import { Button } from "@/components/ui/button";
import { Users, Bike, MapPin, Star, Search, Play, Shield, Clock, CreditCard } from "lucide-react";

const HeroSection = () => {
  const scrollToBikes = () => {
    const bikesSection = document.getElementById('bikes');
    bikesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 md:py-32 bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-6 animate-fade-in">
            Ride Your Way to
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
            Explore beautiful Malpe and Udupi with our premium bikes. 
            Comfortable rides, competitive prices, and easy booking for your coastal adventures.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              onClick={scrollToBikes}
            >
              <Search className="h-5 w-5 mr-2" />
              Find Your Bike
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { number: "1000+", label: "Happy Riders", icon: Users },
              { number: "50+", label: "Quality Bikes", icon: Bike },
              { number: "Malpe", label: "Coastal Location", icon: MapPin },
              { number: "4.9★", label: "User Rating", icon: Star }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-primary group-hover:text-bike-accent transition-colors duration-300" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Fully Insured",
                description: "All bikes come with comprehensive insurance coverage for your peace of mind"
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Round-the-clock customer support and roadside assistance whenever needed"
              },
              {
                icon: CreditCard,
                title: "Easy Booking",
                description: "Simple booking process with instant confirmation and flexible payment options"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gradient-card hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-primary rounded-full group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;