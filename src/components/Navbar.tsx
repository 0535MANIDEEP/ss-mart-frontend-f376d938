
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Menu,
  User,
  LogIn,
  Shield,
  LogOut,
  Home
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import AuthModal from "./AuthModal";
import { ROUTES } from "@/routes";
import AuthButtons from "./AuthButtons";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

type NavItem = {
  icon: React.ReactNode;
  label: string;
  to: string;
  show?: boolean;
};

export default function Navbar() {
  const items = useCartStore(state => state.items);
  const { user, role, signOut, loading } = useSupabaseAuth();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = React.useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );
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

  // Responsive, accessible hamburger for mobile menu
  const menuButton = (
    <button
      className="md:hidden p-2 focus:outline-none rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      aria-label="Open Menu"
      onClick={() => setMenuOpen(v => !v)}
    >
      <Menu size={28} className="text-gray-800 dark:text-lux-gold" />
    </button>
  );

  // Central navigation links (with left-aligned icon + label)
  const navLinks: NavItem[] = [
    {
      icon: <Home className="mr-2" />,
      label: t("home"),
      to: ROUTES.HOME,
      show: true
    },
    {
      icon: <ShoppingCart className="mr-2" />,
      label: "Visit List",
      to: "/visit-list",
      show: true
    },
    {
      icon: <User className="mr-2" />,
      label: t("profile"),
      to: ROUTES.ORDER_SUCCESS,
      show: !!user
    },
    {
      icon: <Shield className="mr-2" />,
      label: t("dashboard"),
      to: ROUTES.ADMIN_DASHBOARD,
      show: role === "admin"
    }
  ];

  // Cart badge
  const cartBadge = cartCount > 0 && (
    <span className="ml-2 bg-emerald-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
      {cartCount}
    </span>
  );
  const cartTotalBadge = cartTotal > 0 && (
    <span className="ml-2 bg-lux-gold/10 px-2 py-0.5 rounded text-lux-gold font-bold text-xs">
      ₹{cartTotal}
    </span>
  );

  return (
    <>
      <nav className="w-full sticky top-0 z-50 bg-white/90 dark:bg-lux-black/90 border-b border-gray-200 dark:border-lux-gold shadow backdrop-blur-md">
        <div className="flex items-center justify-between px-4 sm:px-8 py-2 min-h-[56px] gap-2">
          <div className="flex items-center gap-3">
            {menuButton}
            <Link
              to={ROUTES.ROOT}
              className="text-2xl font-black tracking-wide flex items-center gap-2 text-primary dark:text-lux-gold"
            >
              {t("brand")}
            </Link>
          </div>
          <div className="hidden md:flex gap-5 items-center flex-1 justify-center">
            {navLinks
              .filter(n => n.show)
              .map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition text-base font-medium text-gray-900 dark:text-gray-100"
                  tabIndex={0}
                >
                  {n.icon}
                  {n.label}
                  {n.to === "/visit-list" ? (
                    <>
                      {cartBadge}
                      {cartTotalBadge}
                    </>
                  ) : null}
                </Link>
              ))}
            {/* Google Maps Button */}
            <a
              href="https://g.co/kgs/v1e9RSN"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3"
            >
              <Button variant="outline" className="text-sm">📍 Find SS MART</Button>
            </a>
          </div>
          <div className="hidden md:flex gap-4 items-center ml-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <AuthButtons
              onLogin={() => setAuthModal("login")}
              onSignup={() => setAuthModal("signup")}
              onLogout={handleLogout}
            />
          </div>
        </div>
        {/* Mobile drawer/menu */}
        <div
          className={clsx(
            "fixed inset-0 z-40 bg-white dark:bg-lux-black transition-transform duration-200 px-6 pt-6 pb-32 flex flex-col md:hidden",
            menuOpen
              ? "translate-x-0"
              : "translate-x-full pointer-events-none opacity-0"
          )}
          style={{ minHeight: "100svh" }}
        >
          <button
            className="absolute top-4 right-6 text-3xl font-bold text-gray-400 hover:text-red-500"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            tabIndex={0}
          >
            ×
          </button>

          <div className="mb-8 flex">
            <Link
              to={ROUTES.ROOT}
              className="text-2xl font-black tracking-wide flex items-center gap-2 text-primary dark:text-lux-gold"
              onClick={() => setMenuOpen(false)}
            >
              {t("brand")}
            </Link>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {navLinks
              .filter(n => n.show)
              .map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="flex items-center px-4 py-3 min-h-[48px] rounded-xl text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-800 dark:text-gray-100 transition"
                  onClick={() => setMenuOpen(false)}
                  tabIndex={0}
                >
                  {n.icon}
                  <span className="ml-1">{n.label}</span>
                  {n.to === "/visit-list" ? (
                    <>
                      {cartBadge}
                      {cartTotalBadge}
                    </>
                  ) : null}
                </Link>
              ))}
            {/* Google Maps Button */}
            <a
              href="https://g.co/kgs/v1e9RSN"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4"
            >
              <Button variant="outline" className="text-sm w-full">📍 Find SS MART</Button>
            </a>
          </div>
          <div className="mt-auto mb-6">
            <LanguageSwitcher orientation="horizontal" />
          </div>
          <div className="sticky bottom-0 pb-2 bg-white dark:bg-lux-black">
            <AuthButtons
              onLogin={() => {
                setAuthModal("login");
                setMenuOpen(false);
              }}
              onSignup={() => {
                setAuthModal("signup");
                setMenuOpen(false);
              }}
              onLogout={async () => {
                await handleLogout();
                setMenuOpen(false);
              }}
              asFooter
            />
            <div className="flex justify-center mt-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
        <AuthModal open={!!authModal} mode={authModal as "login" | "signup" | null} onClose={() => setAuthModal(null)} />
      </nav>
    </>
  );
}
