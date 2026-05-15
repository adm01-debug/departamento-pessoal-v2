import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ShieldAlert } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isReady, isAdmin, loading } = useAuth();

  if (!isReady || (loading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Verificando privilégios...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive/60" />
        <h2 className="text-h2 font-display text-foreground">Acesso Restrito</h2>
        <p className="text-body text-muted-foreground max-w-md">
          Você não possui permissão para acessar esta página. Contate o administrador do sistema.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
