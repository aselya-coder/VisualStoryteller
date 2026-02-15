import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/admin/auth/AuthContext";

const RequireAuth = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
};

export default RequireAuth;

