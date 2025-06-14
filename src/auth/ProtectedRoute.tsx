
// Updated to use the new Supabase auth context and check for user session.
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, loading } = useSupabaseAuth();
  if (loading) return null; // Or show loading spinner
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
