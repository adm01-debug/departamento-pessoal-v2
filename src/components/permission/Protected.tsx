import { Navigate, useLocation } from 'react-router-dom';
import { useRBAC } from '@/hooks/useRBAC';
interface ProtectedProps { permission?: string; role?: string; children: React.ReactNode; redirectTo?: string; }
export function Protected({ permission, role, children, redirectTo = '/acesso-negado' }: ProtectedProps) {
  const { hasPermission, hasRole } = useRBAC();
  const location = useLocation();
  const allowed = (permission ? hasPermission(permission) : true) && (role ? hasRole(role) : true);
  if (!allowed) return <Navigate to={redirectTo} state={{ from: location }} replace />;
  return <>{children}</>;
}
