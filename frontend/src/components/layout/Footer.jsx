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
import { useNavigate, useLocation } from "react-router-dom";

export default function Footer() {
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    console.log(element);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAmenitiesClick = (e) => {
    handleScrollTo("amenities");
  };

  const handleGalleryClick = (e) => {
    handleScrollTo("gallery");
  };
  return (
    <footer className="bg-neutral-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-6">The Loyal Hotel</h4>
            <p className="mb-6">
              Trải nghiệm sự sang trọng vô song và dịch vụ đặc biệt trong một
              bối cảnh ngoạn mục.
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
              <FooterLink to="/aboutus">Về Chúng Tôi</FooterLink>
              <FooterLink to="/rooms">Phòng</FooterLink>
              <FooterLink to="/services">Dịch Vụ</FooterLink>
              <FooterLink to="/#amenities">Tiện nghi</FooterLink>
              <FooterLink to="/#gallery">Phòng trưng bày</FooterLink>
              <FooterLink to="/contact">Liên Hệ Với Chúng Tôi</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-amber-300 shrink-0 mt-0.5" />
                <span>11 Sư Vạn Hạnh, Phường 12, Quận 10, Hồ Chí Minh</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-amber-300 shrink-0 mt-0.5" />
                <span>(8484) 3333 9999</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-amber-300 shrink-0 mt-0.5" />
                <span>info@theloyalhotel.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Bản tin</h4>
            <p className="mb-4">
              Đăng ký nhận bản tin của chúng tôi để nhận các ưu đãi và cập nhật độc quyền.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Địa chỉ email của bạn"
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
            &copy; {new Date().getFullYear()} The Loyal Hotel. Đã được đăng ký bản quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isAnchorLink = to.startsWith("/#");
  const anchorId = isAnchorLink ? to.split("#")[1] : null;

  const handleClick = (e) => {
    if (!isAnchorLink) return; // để Link xử lý bình thường

    e.preventDefault(); // chặn chuyển route mặc định

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100); // chờ trang chủ render xong
    } else {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <li>
      <Link
        to={to}
        onClick={handleClick}
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


