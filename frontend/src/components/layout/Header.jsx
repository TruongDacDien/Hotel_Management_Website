import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // 🔄 Sử dụng react-router-dom
import { Menu, X, LogIn, LogOut, UserPlus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { CartIcon } from "../../components/cart/CartIcon";
import { useAuth } from "../../hooks/use-auth";
import { UserCircle } from "lucide-react";
import defaultAvatar from "../../assets/avatar-default.svg";
import { getCustomerAccountById } from "../../config/api";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // 🔄 Không cần destructuring

  const { user, logoutMutation } = useAuth();
  //console.log(user);

  const [userInfor, setUserInfor] = useState(null);
  const fetchUser = async () => {
    if (!user || !user.id) return;
    try {
      const res = await getCustomerAccountById(user.id);

      console.log(res);

      setUserInfor(res);
    } catch (err) {
      console.error("Failed to fetch user");
    }
  };
  useEffect(() => {
    fetchUser();
  }, [user]);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <Link
          to="/"
          onClick={() => {
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }, 50); // delay 50ms là đủ
          }}
        >
          {" "}
          {/* 🔄 `to` thay vì `href` */}
          <div className="flex items-center cursor-pointer">
            <span className="text-primary text-4xl font-bold">The Loyal Hotel</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/rooms">Phòng</NavLink>
          <NavLink to="/services">Dịch vụ</NavLink>
          <NavLink to="/#amenities" onClick={handleAmenitiesClick}>
            Tiện nghi
          </NavLink>
          <NavLink to="/#gallery" onClick={handleGalleryClick}>
            Phòng trưng bày
          </NavLink>
          <div className="flex items-center space-x-4">
            <CartIcon />
            {userInfor ? (
              <div className="flex items-center space-x-3">
                {/* <span className="text-sm">
                  Chào, {user.name?.split(" ")[0]}
                </span> */}
                {/* Nút/link dẫn tới /userprofile */}
                <Link
                  to="/userprofile"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <img
                    src={userInfor?.AvatarURL || defaultAvatar}
                    alt="Avatar"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">
                    Hi, {userInfor.TenKH?.split(" ")[0]}
                  </span>
                </Link>
                {/* {user.isAdmin && (
                  <Link to="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      Admin
                    </Button>
                  </Link>
                )} */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" /> Đăng xuất
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
                    <LogIn className="h-4 w-4 mr-1" /> Đăng nhập
                  </Button>
                </Link>
                {/* <Link to="/auth?tab=register">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-1" /> Register
                  </Button>
                </Link> */}
              </div>
            )}
            <Link to="/rooms">
              <Button className="bg-black text-white cursor-pointer">
                Đặt ngay
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, children, onClick }) {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to.startsWith("/#") && location.pathname === "/");

  return (
    <Link to={to} onClick={onClick}>
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
