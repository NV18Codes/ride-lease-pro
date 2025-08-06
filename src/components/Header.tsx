import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, Phone, User } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      {/* Top info bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Available in 25+ Cities</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>24/7 Support: 1800-123-4567</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Book Now & Get 20% Off First Ride!</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-heading font-bold text-primary">
              BikeRental
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#bikes" className="text-foreground hover:text-primary transition-colors">
              Our Bikes
            </a>
            <a href="#locations" className="text-foreground hover:text-primary transition-colors">
              Locations
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="bg-gradient-primary">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#bikes" className="text-foreground hover:text-primary transition-colors">
                Our Bikes
              </a>
              <a href="#locations" className="text-foreground hover:text-primary transition-colors">
                Locations
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button size="sm" className="bg-gradient-primary">
                  Sign Up
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;