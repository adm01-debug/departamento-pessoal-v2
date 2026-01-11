// V15-524
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
interface PrivateRouteProps { children: React.ReactNode; requiredRoles?: string[]; }
export function PrivateRoute({ children, requiredRoles }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requiredRoles && !requiredRoles.includes(user.role || '')) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
