
import React from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import LoadingScreen from "@/components/LoadingScreen";
import UnauthorizedScreen from "@/components/UnauthorizedScreen";

type Props = {
  allowedRoles: string[];
  children: React.ReactNode;
};

const RoleProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { loading, user, role } = useSupabaseAuth();

  if (loading) return <LoadingScreen />;
  if (!user || !allowedRoles.includes(role)) {
    return <UnauthorizedScreen />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
