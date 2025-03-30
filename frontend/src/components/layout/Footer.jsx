import { Link } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Bookmark,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-6">Elysian Retreat</h4>
            <p className="mb-6">
              Experience unparalleled luxury and exceptional service in a
              breathtaking setting.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Bookmark size={18} />} />
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink to="/">About Us</FooterLink>
              <FooterLink to="/rooms">Rooms & Suites</FooterLink>
              <FooterLink to="/services">Services</FooterLink>
              <FooterLink to="/#amenities">Amenities</FooterLink>
              <FooterLink to="/#gallery">Gallery</FooterLink>
              <FooterLink to="/#contact">Contact Us</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-amber-300 shrink-0 mt-0.5" />
                <span>123 Luxury Avenue, Exclusive District, City</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-amber-300 shrink-0 mt-0.5" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-amber-300 shrink-0 mt-0.5" />
                <span>info@elysianretreat.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Newsletter</h4>
            <p className="mb-4">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Your email address"
                className="rounded-r-none bg-neutral-700 border-neutral-600 focus:border-amber-300"
              />
              <Button
                type="submit"
                className="bg-amber-300 hover:bg-amber-400 text-neutral-800 rounded-l-none"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-700 text-center">
          <p>
            &copy; {new Date().getFullYear()} Elysian Retreat. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="hover:text-amber-300 transition-colors duration-300"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon }) {
  return (
    <a
      href="#"
      className="h-8 w-8 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-amber-300 hover:text-neutral-800 transition-colors duration-300"
    >
      {icon}
    </a>
  );
}
