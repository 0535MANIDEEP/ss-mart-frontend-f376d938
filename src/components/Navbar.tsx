
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { ShoppingCart, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const items = useCartStore(state => state.items);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logout = useAuthStore(state => state.logout);
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("Guest");
  const { t, i18n } = useTranslation();

  // Hamburger state
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole === "admin") {
      setRole("Admin");
    } else if (storedRole) {
      setRole("User");
    } else {
      setRole("Guest");
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/");
  };

  // Responsive: close menu on nav/navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="flex justify-between items-center bg-white dark:bg-lux-black shadow w-full px-3 sm:px-8 py-3 z-50 sticky top-0 transition select-none">
      <div className="flex items-center gap-1">
        {/* Hamburger (mobile) */}
        <button
          className="md:hidden p-2 focus:outline-none rounded hover:bg-lux-gold/10"
          aria-label="Open Menu"
          onClick={() => setMenuOpen(v => !v)}
        >
          <Menu size={28} className="text-gray-700 dark:text-lux-gold" />
        </button>
        <Link to="/" className="text-2xl font-extrabold text-green-600 dark:text-lux-gold tracking-wide ml-1 sm:ml-0 focus:outline-none">
          {t("brand")}
        </Link>
      </div>

      {/* Nav links: mobile (hamburger menu) */}
      <div className={`fixed inset-0 z-50 bg-white/90 dark:bg-lux-black/90 backdrop-blur-sm transform ${menuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 md:relative md:inset-auto md:flex md:gap-8 md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:translate-x-0 flex flex-col md:flex-row items-center md:static md:py-0 py-14 px-6 md:p-0`}>
        <button className="md:hidden absolute top-3 right-6 text-lg text-gray-500 hover:text-red-600" aria-label="Close Menu" onClick={() => setMenuOpen(false)}>×</button>
        <span className="text-base italic sm:inline-block mb-5 md:mb-0 text-gray-600 dark:text-gray-300">
          {t("loggedInAs")}: <strong>{role}</strong>
        </span>
        <Link to="/cart" className="relative flex items-center group mx-3 focus:outline-none" aria-label={t("cart")} tabIndex={0}>
          <ShoppingCart size={26} className="mr-1 group-hover:scale-110 transition-transform text-green-600 dark:text-lux-gold" />
          <span className="hidden sm:inline text-lg">{t("cart")}</span>
          {cartCount > 0 && (
            <span
              className="absolute -top-1.5 left-4 sm:left-6 bg-green-600 text-white rounded-full px-2 py-0.5 text-xs font-bold animate-pulse"
              style={{ minWidth: 18 }}
              aria-label={`${cartCount} ${t("cart")}`}
            >
              {cartCount}
            </span>
          )}
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/admin/dashboard" className="hover:underline">{t("dashboard")}</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition focus:outline-none"
            >
              {t("logout")}
            </button>
          </>
        ) : (
          <Link
            to="/admin/login"
            className={`${location.pathname === "/admin/login" ? "font-bold text-green-600 dark:text-lux-gold" : ""} hover:underline`}
          >
            {t("adminLogin")}
          </Link>
        )}
        <div className="flex gap-2 ml-2 mt-4 md:mt-0">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
