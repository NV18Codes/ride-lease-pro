import { Button } from "@/components/ui/button";
import { Search, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  const scrollToBikes = () => {
    const bikesSection = document.getElementById('bikes');
    bikesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen min-h-[600px] max-h-[800px] bg-gradient-hero overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="https://cdn.pixabay.com/video/2024/10/14/236326_tiny.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
      </div>
      
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-secondary rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-accent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-5xl mx-auto">
          {/* Enhanced Main heading */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-foreground mb-6 animate-fade-in leading-tight">
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
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up leading-relaxed">
            Explore the beautiful coastal paradise of <span className="font-semibold text-primary">Malpe and Udupi</span> with our premium bikes. 
            Comfortable rides, competitive prices, and seamless booking for your coastal adventures.
          </p>

          {/* Enhanced CTA Button */}
          <div className="flex justify-center mb-12 animate-scale-in">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg px-8 py-6 h-auto font-semibold"
              onClick={scrollToBikes}
            >
              <Search className="h-6 w-6 mr-3" />
              Find Your Perfect Ride
            </Button>
          </div>




        </div>
      </div>
    </section>
  );
};

export default HeroSection;