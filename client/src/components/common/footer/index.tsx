import { Link } from "react-router";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800/50 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <p className="text-2xl font-bold font-gothic bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                PARK-IT
              </p>
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-md">
              Find and book parking spots easily. Whether you're looking for hourly or daily parking, we've got you covered.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/parkings" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                  Find Parking
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-purple-500/20">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} PARK-IT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;