import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const authenticated = authService.isAuthenticated();
  return authenticated ? <Navigate to="/" replace /> : <>{children}</>;
}