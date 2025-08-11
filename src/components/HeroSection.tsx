import { Button } from "@/components/ui/button";
import { Users, Bike, MapPin, Star, Search, Play, Shield, Clock, CreditCard, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  const scrollToBikes = () => {
    const bikesSection = document.getElementById('bikes');
    bikesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 md:py-36 bg-gradient-hero overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-secondary rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-accent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Enhanced Main heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-foreground mb-6 animate-fade-in leading-tight">
              Ride Your Way to
              <span className="block bg-gradient-primary bg-clip-text text-transparent animate-pulse-glow">
                Adventure
              </span>
            </h1>
            <div className="flex justify-center items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-lg font-medium text-primary">Premium Bike Rentals</span>
              <Zap className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>

          {/* Enhanced Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-slide-up leading-relaxed">
            Explore the beautiful coastal paradise of <span className="font-semibold text-primary">Malpe and Udupi</span> with our premium bikes. 
            Comfortable rides, competitive prices, and seamless booking for your coastal adventures.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-scale-in">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg px-8 py-6 h-auto font-semibold"
              onClick={scrollToBikes}
            >
              <Search className="h-6 w-6 mr-3" />
              Find Your Perfect Ride
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-lg px-8 py-6 h-auto font-semibold hover:shadow-lg"
            >
              <Play className="h-6 w-6 mr-3" />
              Watch Demo
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[
              { number: "1000+", label: "Happy Riders", icon: Users, color: "text-bike-purple" },
              { number: "50+", label: "Quality Bikes", icon: Bike, color: "text-bike-orange" },
              { number: "Malpe", label: "Coastal Location", icon: MapPin, color: "text-bike-teal" },
              { number: "4.9★", label: "User Rating", icon: Star, color: "text-bike-pink" }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-110 transition-transform duration-500 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-center mb-4">
                  <div className={`p-4 bg-gradient-card rounded-2xl shadow-soft group-hover:shadow-lg transition-all duration-300 ${stat.color}`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Enhanced Features */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Fully Insured",
                description: "All bikes come with comprehensive insurance coverage for your peace of mind",
                gradient: "from-bike-purple to-bike-pink"
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Round-the-clock customer support and roadside assistance whenever needed",
                gradient: "from-bike-orange to-bike-pink"
              },
              {
                icon: CreditCard,
                title: "Easy Booking",
                description: "Simple booking process with instant confirmation and flexible payment options",
                gradient: "from-bike-teal to-bike-purple"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-gradient-card hover:shadow-lg transition-all duration-500 group hover:-translate-y-2 animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex justify-center mb-6">
                  <div className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;