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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = async () => {
    await signOut();
    localStorage.clear();
    navigate(ROUTES.ROOT);
  };

  const menuButton = (
    <button
      className="md:hidden p-2 rounded-full border border-ssblue-secondary bg-white/80 dark:bg-[#22326c] shadow focus:outline-none hover:shadow-lg transition duration-150"
      aria-label="Open Menu"
      onClick={() => setMenuOpen(v => !v)}
      tabIndex={0}
    >
      <Menu size={26} className="text-ssblue-primary dark:text-ssblue-accent" />
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
    <span className="ml-2 bg-ssblue-secondary text-white rounded-full px-2 py-0.5 text-xs font-bold shadow border border-ssblue-primary">
      {cartCount}
    </span>
  );
  const cartTotalBadge = cartTotal > 0 && (
    <span className="ml-2 bg-ssblue-card px-2 py-0.5 rounded text-ssblue-primary font-bold text-xs border border-ssblue-secondary shadow">
      ₹{cartTotal}
    </span>
  );

  return (
    <>
      {/* Nav Container */}
      <nav className="navbar w-full sticky top-0 z-50 shadow-md backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2 px-1.5 sm:px-4 py-2 min-h-[60px]">
            {/* Left: Brand & Menu */}
            <div className="flex items-center gap-1 md:gap-3">
              {menuButton}
              <Link
                to={ROUTES.ROOT}
                className="text-xl sm:text-2xl font-black tracking-wide flex items-center gap-1 sm:gap-2 text-ssblue-onblue pr-2 pl-0.5 md:pl-0"
                style={{ letterSpacing: "0.01em" }}
              >
                {t("brand")}
              </Link>
            </div>
            {/* Center nav links */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-1 sm:gap-2">
              {navLinks
                .filter(n => n.show)
                .map(n => (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={clsx(
                      "nav-link",
                      "flex items-center gap-2 rounded-xl px-4 py-2 min-h-[42px] text-base font-semibold transition-colors duration-150",
                      "hover:bg-ssblue-accent/20 dark:hover:bg-ssblue-accent/10",
                      "focus:bg-ssblue-secondary/20 dark:focus:bg-ssblue-secondary/20",
                      "active:ring-2 active:ring-ssblue-accent/60 active:scale-[.97]",
                      "text-ssblue-onblue dark:text-ssblue-onblue"
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
              {/* "Find SS MART" button */}
              <a
                href="https://g.co/kgs/v1e9RSN"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 sm:ml-4"
              >
                <Button
                  variant="outline"
                  className="text-xs sm:text-sm border-ssblue-secondary hover:border-ssblue-primary transition-shadow text-ssblue-primary"
                  style={{
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    borderWidth: 1.2,
                    background: "#F3F9FE"
                  }}
                >
                  <span className="hidden xs:inline">📍 </span>Find SS MART
                </Button>
              </a>
            </div>
            {/* Right section */}
            <div className="hidden md:flex gap-2 sm:gap-4 items-center ml-2 sm:ml-4 pr-1 sm:pr-2">
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
            "fixed inset-0 z-[60] bg-ssblue-card dark:bg-[#152044] transition-transform duration-200 px-2 pt-4 pb-24 flex flex-col md:hidden shadow-2xl border-l border-ssblue-secondary/40",
            menuOpen
              ? "translate-x-0"
              : "translate-x-full pointer-events-none opacity-0"
          )}
          style={{ minHeight: "100svh" }}
        >
          {/* Close Button */}
          <button
            className="absolute top-3 right-4 text-3xl font-bold text-ssblue-secondary hover:text-red-500 focus:outline focus:ring-2 focus:ring-red-400"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            tabIndex={0}
          >
            ×
          </button>
          {/* Mobile Brand */}
          <div className="mb-3 flex">
            <Link
              to={ROUTES.ROOT}
              className="text-xl font-black tracking-wide flex items-center gap-2 text-ssblue-primary pl-1"
              onClick={() => setMenuOpen(false)}
            >
              {t("brand")}
            </Link>
          </div>
          {/* Mobile nav links */}
          <div className="flex flex-col gap-1 flex-1">
            {navLinks
              .filter(n => n.show)
              .map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={clsx(
                    "nav-link",
                    "flex items-center px-3 py-2 min-h-[44px] rounded-xl text-base font-semibold transition-colors",
                    "hover:bg-ssblue-accent/25 dark:hover:bg-ssblue-accent/10",
                    "focus:bg-ssblue-accent/25 dark:focus:bg-ssblue-accent/20",
                    "active:ring-2 active:ring-ssblue-accent/50",
                    "text-ssblue-primary dark:text-ssblue-accent"
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
              className="mt-5 block"
            >
              <Button
                variant="outline"
                className="text-xs w-full border-ssblue-secondary hover:border-ssblue-primary"
                style={{
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  borderWidth: 1.2
                }}
              >
                <span className="hidden xs:inline mr-1">📍</span>Find SS MART
              </Button>
            </a>
          </div>
          <div className="mt-auto mb-2">
            <LanguageSwitcher orientation="horizontal" />
          </div>
          {/* Mobile Auth + Theme toggle */}
          <div className="sticky bottom-0 pb-1 bg-ssblue-card dark:bg-[#192049] border-t border-ssblue-secondary/30">
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
            <div className="flex justify-center mt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
        <AuthModal open={!!authModal} mode={authModal as "login" | "signup" | null} onClose={() => setAuthModal(null)} />
      </nav>
    </>
  );
}
