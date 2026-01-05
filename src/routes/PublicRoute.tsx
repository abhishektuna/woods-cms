import { Navigate } from "react-router-dom";
import type { ComponentType } from "react";
import { useAuth } from "../hooks/auth/useAuth";

export function PublicRoute(Component: ComponentType) {
  return function PublicComponent() {
    const { isAuthenticated, role } = useAuth();

    if (isAuthenticated && role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Component />;
  };
}
