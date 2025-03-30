import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // 🔄 Sử dụng react-router-dom
import { Menu, X, LogIn, LogOut, UserPlus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { CartIcon } from "../../components/cart/CartIcon";
import { useAuth } from "../../hooks/use-auth";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // 🔄 Không cần destructuring

  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]); // 🔄 Đúng cách để theo dõi thay đổi đường dẫn

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header
      className={`fixed w-full bg-white z-50 transition-all duration-300 ${
        scrolled ? "shadow-md py-2" : "py-3"
      }`}
    >
      <div className="w-full px-4 flex items-center justify-between">
        <Link to="/">
          {" "}
          {/* 🔄 `to` thay vì `href` */}
          <div className="flex items-center cursor-pointer">
            <span className="text-primary text-4xl font-bold">Hotel</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/rooms">Rooms</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/amenities">Amenities</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <div className="flex items-center space-x-4">
            <CartIcon />
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm">Hi, {user.name?.split(" ")[0]}</span>
                {user.isAdmin && (
                  <Link to="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <LogIn className="h-4 w-4 mr-1" /> Sign In
                  </Button>
                </Link>
                <Link to="/auth?tab=register">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-1" /> Register
                  </Button>
                </Link>
              </div>
            )}
            <Link to="/rooms">
              <Button className="cursor-pointer">Book Now</Button>
            </Link>
          </div>
        </nav>

        <div className="flex items-center md:hidden">
          <CartIcon />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 shadow-md">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <MobileNavLink to="/rooms">Rooms</MobileNavLink>
            <MobileNavLink to="/services">Services</MobileNavLink>
            <MobileNavLink to="/amenities">Amenities</MobileNavLink>
            <MobileNavLink to="/gallery">Gallery</MobileNavLink>
            {user ? (
              <div className="flex flex-col space-y-2">
                <div className="py-2 text-sm">Logged in as {user.name}</div>
                {user.isAdmin && (
                  <Link to="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center"
                    >
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center justify-center"
                >
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/auth">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center"
                  >
                    <LogIn className="h-4 w-4 mr-1" /> Sign In
                  </Button>
                </Link>
                <Link to="/auth?tab=register">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full flex items-center justify-center"
                  >
                    <UserPlus className="h-4 w-4 mr-1" /> Register
                  </Button>
                </Link>
              </div>
            )}
            <Link to="/rooms">
              <Button className="w-full cursor-pointer">Book Now</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to.startsWith("/#") && location.pathname === "/");

  return (
    <Link to={to}>
      <div
        className={`font-medium cursor-pointer transition-colors duration-300 ${
          isActive ? "text-primary" : "text-neutral-700 hover:text-primary"
        }`}
      >
        {children}
      </div>
    </Link>
  );
}

function MobileNavLink({ to, children }) {
  return <NavLink to={to}>{children}</NavLink>;
}
