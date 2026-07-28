import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldAlert } from 'lucide-react';
import { loggerService } from '@/services/loggerService';

interface AdminRouteProps {
  children: React.ReactNode;
}

// 'pending-challenge' = enrolled but aal1 session — must complete TOTP before access
// MFA gate disabled: mfaState stays in 'checking' until verified, then renders children.
type MfaState = 'checking' | 'verified';

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isReady, isAdmin, loading } = useAuth();
  const [mfaState, setMfaState] = useState<MfaState>('checking');

  useEffect(() => {
    if (!isReady || !isAdmin || !user) return;

    let cancelled = false;
    // MFA check disabled — admin access granted once isAdmin is confirmed.
    // To re-enable, restore the mfaState checks below and the gate rendering in the JSX.
    supabase.auth.mfa.getAuthenticatorAssuranceLevel().then(({ data }) => {
      if (cancelled) return;
      loggerService.info('AdminRoute: MFA check skipped (disabled)', {
        userId: user.id,
        currentLevel: data?.currentLevel,
        nextLevel: data?.nextLevel,
      });
      setMfaState('verified');
    }).catch(() => {
      if (!cancelled) {
        loggerService.warn('AdminRoute: MFA check failed — granting access (MFA disabled)', { userId: user?.id });
        setMfaState('verified');
      }
    });

    return () => { cancelled = true; };
  }, [isReady, isAdmin, user]);

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

  if (mfaState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Verificando privilégios...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
