// V15-525
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
interface PublicRouteProps { children: React.ReactNode; }
export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
