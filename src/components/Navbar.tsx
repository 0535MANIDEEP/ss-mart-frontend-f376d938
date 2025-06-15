
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

  const menuButton = (
    <button
      className="md:hidden p-2 rounded-full border border-gray-200 dark:border-lux-gold bg-white/70 dark:bg-lux-black/70 shadow focus:outline-none hover:shadow-lg transition duration-150"
      aria-label="Open Menu"
      onClick={() => setMenuOpen(v => !v)}
      tabIndex={0}
    >
      <Menu size={26} className="text-gray-800 dark:text-lux-gold" />
    </button>
  );

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

  const cartBadge = cartCount > 0 && (
    <span className="ml-2 bg-emerald-600 text-white rounded-full px-2 py-0.5 text-xs font-bold shadow border border-emerald-700">
      {cartCount}
    </span>
  );
  const cartTotalBadge = cartTotal > 0 && (
    <span className="ml-2 bg-lux-gold/10 px-2 py-0.5 rounded text-lux-gold font-bold text-xs border border-lux-gold/40 shadow">
      ₹{cartTotal}
    </span>
  );

  return (
    <>
      {/* Nav Container */}
      <nav className="w-full sticky top-0 z-50 bg-white/95 dark:bg-lux-black/90 border-b border-gray-200 dark:border-lux-gold shadow-md backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 px-2 sm:px-6 py-2 min-h-[60px]">

            {/* Left: Brand & Menu */}
            <div className="flex items-center gap-2 md:gap-4">
              {menuButton}
              <Link
                to={ROUTES.ROOT}
                className="text-2xl font-black tracking-wide flex items-center gap-2 text-primary dark:text-lux-gold pr-3 pl-1 md:pl-0"
                style={{ letterSpacing: "0.01em" }}
              >
                {t("brand")}
              </Link>
            </div>

            {/* Center nav links */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-2">
              {navLinks
                .filter(n => n.show)
                .map(n => (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={clsx(
                      "flex items-center gap-2 rounded-xl px-5 py-2 min-h-[44px] text-base font-semibold transition-colors duration-150",
                      "hover:bg-lux-gold/20 dark:hover:bg-lux-gold/10",
                      "focus:bg-lux-gold/30 dark:focus:bg-lux-gold/20",
                      "active:ring-2 active:ring-lux-gold/60 active:scale-[.97]",
                      "text-gray-900 dark:text-gray-100"
                    )}
                    tabIndex={0}
                  >
                    {n.icon}
                    {n.label}
                    {n.to === "/visit-list" && (
                      <>
                        {cartBadge}
                        {cartTotalBadge}
                      </>
                    )}
                  </Link>
                ))}
              <a
                href="https://g.co/kgs/v1e9RSN"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4"
              >
                <Button
                  variant="outline"
                  className="text-sm border-lux-gold/30 hover:border-lux-gold/65 transition-shadow"
                  style={{
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    borderWidth: 1.2
                  }}
                >
                  📍 Find SS MART
                </Button>
              </a>
            </div>

            {/* Right section */}
            <div className="hidden md:flex gap-4 items-center ml-4 pr-2">
              <ThemeToggle />
              <LanguageSwitcher />
              <AuthButtons
                onLogin={() => setAuthModal("login")}
                onSignup={() => setAuthModal("signup")}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={clsx(
            "fixed inset-0 z-40 bg-white dark:bg-lux-black transition-transform duration-200 px-6 pt-6 pb-32 flex flex-col md:hidden shadow-2xl border-l border-lux-gold/20",
            menuOpen
              ? "translate-x-0"
              : "translate-x-full pointer-events-none opacity-0"
          )}
          style={{ minHeight: "100svh" }}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-6 text-3xl font-bold text-gray-400 hover:text-red-500 focus:outline focus:ring-2 focus:ring-red-400"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            tabIndex={0}
          >
            ×
          </button>

          {/* Mobile Brand */}
          <div className="mb-4 flex">
            <Link
              to={ROUTES.ROOT}
              className="text-2xl font-black tracking-wide flex items-center gap-2 text-primary dark:text-lux-gold pl-1"
              onClick={() => setMenuOpen(false)}
            >
              {t("brand")}
            </Link>
          </div>

          {/* Mobile nav links */}
          <div className="flex flex-col gap-2 flex-1">
            {navLinks
              .filter(n => n.show)
              .map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={clsx(
                    "flex items-center px-4 py-3 min-h-[48px] rounded-xl text-lg font-semibold transition-colors",
                    "hover:bg-lux-gold/20 dark:hover:bg-lux-gold/10",
                    "focus:bg-lux-gold/30 dark:focus:bg-lux-gold/20",
                    "active:ring-2 active:ring-lux-gold/50",
                    "text-gray-800 dark:text-gray-100"
                  )}
                  onClick={() => setMenuOpen(false)}
                  tabIndex={0}
                >
                  {n.icon}
                  <span className="ml-1">{n.label}</span>
                  {n.to === "/visit-list" && (
                    <>
                      {cartBadge}
                      {cartTotalBadge}
                    </>
                  )}
                </Link>
              ))}
            {/* Mobile Google Maps */}
            <a
              href="https://g.co/kgs/v1e9RSN"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5"
            >
              <Button
                variant="outline"
                className="text-sm w-full border-lux-gold/30 hover:border-lux-gold/65"
                style={{
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  borderWidth: 1.2
                }}
              >
                📍 Find SS MART
              </Button>
            </a>
          </div>
          <div className="mt-auto mb-3">
            <LanguageSwitcher orientation="horizontal" />
          </div>
          {/* Mobile Auth + Theme toggle */}
          <div className="sticky bottom-0 pb-2 bg-white dark:bg-lux-black border-t border-gray-200/60 dark:border-lux-gold/40">
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

