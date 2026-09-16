import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const authenticated = authService.isAuthenticated();
  return authenticated ? <>{children}</> : <Navigate to="/login" replace />;
}