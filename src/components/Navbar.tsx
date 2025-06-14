
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Menu, User, LogIn, Shield, LogOut, Home } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";

const badgeStyle = {
  guest: "bg-gray-100 text-gray-600 border-gray-300",
  user: "bg-blue-50 text-blue-800 border-blue-300",
  admin: "bg-yellow-100 text-amber-700 border-yellow-400 font-bold"
};

const NavbarRoleItems = ({ role, user, t, onLogin, onSignup, onLogout }) => {
  switch (role) {
    case "guest":
      return (
        <>
          <Button
            onClick={onLogin}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 min-h-[44px] text-white font-semibold focus-visible:ring-2 focus-visible:ring-blue-400"
          ><LogIn /> {t("login")}</Button>
          <Button
            onClick={onSignup}
            className="bg-emerald-600 hover:bg-emerald-700 rounded-lg px-4 py-2 min-h-[44px] text-white font-semibold focus-visible:ring-2 focus-visible:ring-green-400"
          ><User /> {t("signUp")}</Button>
        </>
      );
    case "user":
      return (
        <>
          <Link
            to={ROUTES.HOME}
            className="text-base px-4 py-2 rounded-lg hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Home className="inline mr-1" /> {t("home")}
          </Link>
          <Link
            to={ROUTES.CART}
            className="text-base px-4 py-2 rounded-lg hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <ShoppingCart className="inline mr-1" /> {t("cart")}
          </Link>
          <Link
            to={ROUTES.ORDER_SUCCESS}
            className="text-base px-4 py-2 rounded-lg hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <User className="inline mr-1" /> {t("profile")}
          </Link>
          <Button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 min-h-[44px] text-white font-semibold focus-visible:ring-2 focus-visible:ring-red-400 ml-2"
          >
            <LogOut /> {t("logout")}
          </Button>
        </>
      );
    case "admin":
      return (
        <>
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            className="text-base px-4 py-2 rounded-lg hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-yellow-400 font-semibold"
          ><Shield className="inline mb-0.5" /> {t("dashboard")}</Link>
          <Button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 min-h-[44px] text-white font-semibold focus-visible:ring-2 focus-visible:ring-red-400"
          ><LogOut /> {t("logout")}</Button>
        </>
      );
    default:
      return null;
  }
};

const Navbar = () => {
  const items = useCartStore(state => state.items);
  const { user, role, signOut, loading } = useSupabaseAuth();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [authModal, setAuthModal] = useState<null | "login" | "signup">(null);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    localStorage.clear();
    navigate(ROUTES.ROOT);
  };

  return (
    <nav className="flex justify-between items-center bg-white dark:bg-lux-black shadow w-full px-2 sm:px-8 py-2 z-50 sticky top-0 transition select-none border-b border-gray-200 dark:border-lux-gold min-h-[56px]">
      <div className="flex items-center gap-2">
        <button
          className="md:hidden p-2 focus:outline-none rounded-full hover:bg-gray-50 dark:hover:bg-gray-900"
          aria-label="Open Menu" onClick={() => setMenuOpen(v => !v)}>
          <Menu size={24} className="text-gray-700 dark:text-lux-gold" />
        </button>
        <Link to={ROUTES.ROOT} className="text-2xl font-black text-primary dark:text-lux-gold tracking-wide ml-2 sm:ml-0 flex items-center gap-2">
          {t("brand")}
        </Link>
      </div>
      <div className={`fixed inset-0 z-40 bg-white/90 dark:bg-lux-black backdrop-blur-md transform ${menuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-200 md:relative md:inset-auto md:translate-x-0 md:flex md:gap-6 flex flex-col md:flex-row items-center md:static md:bg-transparent md:backdrop-blur-none`}>
        <button
          className="md:hidden absolute top-3 right-6 text-lg text-gray-500 dark:text-lux-gold hover:text-red-600"
          aria-label="Close Menu"
          onClick={() => setMenuOpen(false)}
        >×</button>
        <span className={
          "flex items-center gap-2 mb-5 md:mb-0 border font-medium px-3 py-1 rounded-full text-sm shadow-sm " +
          (badgeStyle[role as keyof typeof badgeStyle] || badgeStyle.guest)
        } aria-label="Role" style={{ color: "#232336", background: "#FBFBFE", border: "1.5px solid #E1E1EC" }}>
          <User size={16} /> {loading ? "…" : role}
        </span>
        <div className="flex gap-2 items-center">
          <NavbarRoleItems
            role={role || "guest"}
            user={user}
            t={t}
            onLogin={() => setAuthModal("login")}
            onSignup={() => setAuthModal("signup")}
            onLogout={handleLogout}
          />
        </div>
        <Link
          to={ROUTES.CART}
          className="ml-5 relative flex items-center group focus:outline-none"
          aria-label={t("cart")}
          tabIndex={0}
        >
          <ShoppingCart size={24} />
          <span className="sr-only">{t("cart")}</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 left-4 bg-emerald-600 text-white rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{ minWidth: 18, minHeight: 24, borderRadius: 8, fontSize: 14 }}>
              {cartCount}
            </span>
          )}
          {cartTotal > 0 && (
            <span className="ml-2 bg-lux-gold/10 px-2 py-0.5 rounded text-lux-gold font-bold text-xs"
                  style={{ borderRadius: 8, minHeight: 24 }}>
              ₹{cartTotal}
            </span>
          )}
        </Link>
        <div className="flex gap-2 ml-3 mt-6 md:mt-0 items-center">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
      <AuthModal open={!!authModal} mode={authModal as "login" | "signup" | null} onClose={() => setAuthModal(null)} />
    </nav>
  );
};

export default Navbar;
