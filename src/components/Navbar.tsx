import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Menu, User, LogIn, LogOut, Home, Shield } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const items = useCartStore(state => state.items);
  const { user, signOut, role, loading } = useSupabaseAuth();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  // Responsive: close menu on nav/navigation
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center bg-white dark:bg-lux-black shadow w-full px-3 sm:px-8 py-3 z-50 sticky top-0 transition select-none">
      {/* LEFT: Brand + Hamburger */}
      <div className="flex items-center gap-1">
        <button className="md:hidden p-2 focus:outline-none rounded hover:bg-lux-gold/10"
          aria-label="Open Menu" onClick={() => setMenuOpen(v => !v)}>
          <Menu size={28} className="text-gray-700 dark:text-lux-gold" />
        </button>
        <Link to="/" className="text-2xl font-extrabold text-green-600 dark:text-lux-gold tracking-wide ml-1 sm:ml-0 focus:outline-none flex items-center gap-2">
          {t("brand")}
        </Link>
      </div>
      {/* CENTER/MAIN NAV */}
      <div className={`fixed inset-0 z-50 bg-white/90 dark:bg-lux-black/90 backdrop-blur-sm transform ${menuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 md:relative md:inset-auto md:flex md:gap-8 md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:translate-x-0 flex flex-col md:flex-row items-center md:static md:py-0 py-14 px-6 md:p-0`}>
        <button className="md:hidden absolute top-3 right-6 text-lg text-gray-500 hover:text-red-600" aria-label="Close Menu" onClick={() => setMenuOpen(false)}>×</button>
        <span className="text-base italic sm:inline-block mb-5 md:mb-0 text-gray-600 dark:text-gray-300">
          {t("loggedInAs")}: <strong>{loading ? "..." : role.charAt(0).toUpperCase() + role.slice(1)}</strong>
        </span>
        <Link
          to="/home"
          className={`mx-3 hover:underline text-base ${location.pathname === "/home" ? "font-bold text-lux-gold underline" : "text-gray-700 dark:text-gray-100"}`}
          tabIndex={0}
        >
          <Home className="inline mr-1 -mt-1" size={19} /> {t("home")}
        </Link>
        <Link
          to="/products/1"
          className={`mx-3 hover:underline text-base ${location.pathname.startsWith("/products") ? "font-bold text-lux-gold underline" : "text-gray-700 dark:text-gray-100"}`}
          tabIndex={0}
        >
          {t("products")}
        </Link>
        <Link
          to="/cart"
          className="relative flex items-center group mx-3 focus:outline-none"
          aria-label={t("cart")}
          tabIndex={0}
        >
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
          {cartTotal > 0 && (
            <span className="ml-2 text-sm font-bold text-green-800 dark:text-lux-gold bg-lux-gold/10 px-2 py-0.5 rounded">
              ₹{cartTotal}
            </span>
          )}
        </Link>
        {user ? (
          <>
            {/* Admin controls */}
            {role === "admin" && (
              <Link to="/admin/dashboard" className="hover:underline flex items-center gap-1 text-green-600 font-semibold">
                <Shield className="size-4" /> Admin {t("dashboard")}
              </Link>
            )}
            {/* User controls */}
            {(role === "user" || role === "admin") && (
              <Link to="/order-success" className="hover:underline flex items-center gap-1">
                <User className="size-4" /> {t("account") || "Account"}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition focus:outline-none flex items-center gap-1"
            >
              <LogOut className="size-4" /> {t("logout")}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/auth"
              className={`${location.pathname === "/auth" ? "font-bold text-green-600 dark:text-lux-gold" : ""} hover:underline flex items-center gap-1`}
            >
              <LogIn className="size-4" /> {t("adminLogin")}
            </Link>
          </>
        )}
        <div className="flex gap-4 ml-4 mt-6 md:mt-0 items-center">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
