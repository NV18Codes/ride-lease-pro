import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, Phone, User, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-soft">
      {/* Top info bar */}
      <div className="bg-gradient-primary text-primary-foreground py-3 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary-foreground/90" />
              <span className="font-medium">Malpe, Udupi</span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <Phone className="h-4 w-4 text-primary-foreground/90" />
              <span className="font-medium">24/7 Support</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="font-medium">Book Now & Ride Today!</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
              AMILIE'S BIKE RENTAL
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#bikes" className="text-foreground hover:text-primary transition-colors font-medium relative group">
              Bikes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            {user && (
              <button 
                onClick={() => navigate('/bookings')}
                className="text-foreground hover:text-primary transition-colors font-medium relative group"
              >
                My Bookings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground font-medium">
                  Welcome, {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/auth')}
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button 
                  size="sm" 
                  className="bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300 transform" 
                  onClick={() => navigate('/auth')}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border/50 bg-card/50 backdrop-blur-sm rounded-lg animate-slide-in-right">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium px-4 py-2 rounded-lg hover:bg-accent/50">
                Home
              </a>
              <a href="#bikes" className="text-foreground hover:text-primary transition-colors font-medium px-4 py-2 rounded-lg hover:bg-accent/50">
                Bikes
              </a>
              {user && (
                <button 
                  onClick={() => navigate('/bookings')}
                  className="text-foreground hover:text-primary transition-colors font-medium text-left px-4 py-2 rounded-lg hover:bg-accent/50"
                >
                  My Bookings
                </button>
              )}
              <div className="flex flex-col space-y-3 pt-4 border-t border-border/50 px-4">
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground font-medium px-2">
                      Welcome, {user.email}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={signOut}
                      className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300 justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/auth')}
                      className="hover:bg-primary/10 hover:text-primary transition-all duration-300 justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300 justify-start" 
                      onClick={() => navigate('/auth')}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;