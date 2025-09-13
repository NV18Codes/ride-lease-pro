import { Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-bike-light to-bike-cream border-t border-bike-sand/20">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            {/* Company Logo */}
                  <div className="text-center md:text-left">
                    <img 
                      src="/logo.png" 
                      alt="Bike Rental Logo" 
                      className="h-12 sm:h-14 md:h-16 w-auto drop-shadow-2xl mx-auto md:mx-0 mb-2 sm:mb-3 hover:drop-shadow-3xl transition-all duration-500 hover:scale-110"
                    />
                    <p className="text-bike-gray text-xs sm:text-sm max-w-xs mx-auto md:mx-0">
                      Premium bike rentals in Malpe & Udupi
                    </p>
                  </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6">
            <a 
              href="tel:+917892227029" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 group"
              aria-label="Call us at +91 78922 27029"
            >
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-bike-primary group-hover:text-bike-secondary transition-colors duration-200" />
              <span className="text-bike-gray text-xs sm:text-sm group-hover:text-bike-secondary transition-colors duration-200">+91 78922 27029</span>
            </a>
            <a 
              href="mailto:amilebikerental@gmail.com" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 group"
              aria-label="Email us at amilebikerental@gmail.com"
            >
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-bike-primary group-hover:text-bike-secondary transition-colors duration-200" />
              <span className="text-bike-gray text-xs sm:text-sm break-all sm:break-normal group-hover:text-bike-secondary transition-colors duration-200">amilebikerental@gmail.com</span>
            </a>
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
