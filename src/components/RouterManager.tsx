
import React, { Suspense } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import UnauthorizedScreen from "@/components/UnauthorizedScreen";

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
  // Always allow /unauthorized, /loading, /not-found for all users
  if (["/unauthorized", "/loading", "/not-found"].includes(location.pathname)) return <Outlet />;
  // Special routes: redirect admin to dashboard root
  if (role === "admin" && location.pathname === "/home") return <Navigate to="/admin/dashboard" replace />;
  if (!user && (location.pathname.startsWith("/admin") || location.pathname.startsWith("/order-success"))) {
    return <Navigate to="/unauthorized" />;
  }
  return <Outlet />;
};
export default RouterManager;
