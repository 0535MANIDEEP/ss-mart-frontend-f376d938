
import React from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import LoadingScreen from "@/components/LoadingScreen";
import UnauthorizedScreen from "@/components/UnauthorizedScreen";

type Props = {
  allowedRoles: string[];
  children: React.ReactNode;
};

/**
 * Always returns a fallback: never blank screen on role guard!
 * - Loading: spinner while waiting for role
 * - Unauthorized: block with fallback screen
 */
const RoleProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { loading, user, role } = useSupabaseAuth();

  if (loading) return <LoadingScreen />;
  if (!user || !allowedRoles.includes(role)) {
    return <UnauthorizedScreen />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
