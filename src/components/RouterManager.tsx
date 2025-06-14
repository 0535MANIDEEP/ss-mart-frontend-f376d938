
import React, { Suspense } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import UnauthorizedScreen from "@/components/UnauthorizedScreen";
import { ROUTES } from "@/routes";

/**
 * Central router gate that handles:
 * - Auth loading and role fetch suspense
 * - Redirects based on required role and current user's role
 * - Fallbacks for unauthorized or not-found screens
 */
const RouterManager = () => {
  const { user, role, loading } = useSupabaseAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  // Always allow unauthorized, loading, not-found for all users
  if ([ROUTES.UNAUTHORIZED, ROUTES.LOADING, ROUTES.NOT_FOUND].includes(location.pathname)) return <Outlet />;
  // Special route: redirect admin to dashboard root
  if (role === "admin" && location.pathname === ROUTES.HOME) return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  if (!user && (location.pathname.startsWith("/admin") || location.pathname.startsWith("/order-success"))) {
    return <Navigate to={ROUTES.UNAUTHORIZED} />;
  }
  return <Outlet />;
};
export default RouterManager;
