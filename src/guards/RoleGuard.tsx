// V15-343
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
interface RoleGuardProps { children: React.ReactNode; roles: string[]; fallback?: string; }
export function RoleGuard({ children, roles, fallback = '/dashboard' }: RoleGuardProps) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role || '')) return <Navigate to={fallback} replace />;
  return <>{children}</>;
}
