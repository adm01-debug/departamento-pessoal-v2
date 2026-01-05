import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingPage } from "@/components/ui/loading-spinner";
interface ProtectedRouteProps { children: React.ReactNode; requiredPermission?: string; }
export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();
  if (isLoading) return <LoadingPage text="Verificando autenticação..." />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requiredPermission && !hasPermission(requiredPermission)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingPage text="Carregando..." />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}
export default ProtectedRoute;
