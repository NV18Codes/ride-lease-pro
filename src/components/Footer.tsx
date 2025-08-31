import { Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-bike-light to-bike-cream border-t border-bike-sand/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            {/* Company Logo */}
                  <div className="text-center md:text-left">
                    <img 
                      src="/logo.png" 
                      alt="Bike Rental Logo" 
                      className="h-16 w-auto drop-shadow-2xl mx-auto md:mx-0 mb-3 hover:drop-shadow-3xl transition-all duration-500 hover:scale-110"
                    />
                    <p className="text-bike-gray text-sm">
                      Premium bike rentals in Malpe & Udupi
                    </p>
                  </div>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-bike-primary" />
              <span className="text-bike-gray text-sm">+91 77600 90695</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-bike-primary" />
              <span className="text-bike-gray text-sm">info@amiliesbikerental.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-bike-sand/20 mt-6 pt-4">
          <div className="text-center">
                                <p className="text-bike-gray text-xs">
                      © 2024 Bike Rental. All rights reserved.
                    </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
