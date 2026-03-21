import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

interface ProtectedRouteProps {
  requiredRole?: "SUPERADMIN" | "ENTERPRISE" | "USER";
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, token } = useAppStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "SUPERADMIN") {
    // If not authorized, redirect them to their respective homepage
    if (user.role === "ENTERPRISE") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
