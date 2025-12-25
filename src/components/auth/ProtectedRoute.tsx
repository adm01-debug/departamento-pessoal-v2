import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import type { Permission } from '@/types/permissions';
import type { ReactNode } from 'react';
interface Props { children: ReactNode; requiredPermission?: Permission; }
export function ProtectedRoute({ children, requiredPermission }: Props) {
  const { user, loading } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requiredPermission && !hasPermission(requiredPermission)) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}
