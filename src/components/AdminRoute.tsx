import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminRouteProps {
  children: React.ReactNode;
}

type MfaState = 'checking' | 'enrolled' | 'missing';

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isReady, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [mfaState, setMfaState] = useState<MfaState>('checking');

  useEffect(() => {
    if (!isReady || !isAdmin || !user) return;

    let cancelled = false;
    supabase.auth.mfa.getAuthenticatorAssuranceLevel().then(({ data }) => {
      if (cancelled) return;
      // If the session is already at aal2, MFA is satisfied
      if (data?.currentLevel === 'aal2') {
        setMfaState('enrolled');
        return;
      }
      // If nextLevel is aal2, user has enrolled TOTP but hasn't verified this session —
      // they should have been forced through the TOTP challenge at login. Treat as enrolled.
      if (data?.nextLevel === 'aal2') {
        setMfaState('enrolled');
        return;
      }
      // Admin with no MFA enrolled at all — enforcement required
      setMfaState('missing');
    }).catch(() => {
      // On error, allow access rather than blocking valid admins (fail-open on MFA CHECK,
      // not on access control; the auth itself was already validated above)
      if (!cancelled) setMfaState('enrolled');
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
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Verificando autenticação de dois fatores...</p>
        </div>
      </div>
    );
  }

  if (mfaState === 'missing') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-12 text-center min-h-screen bg-background">
        <div className="h-20 w-20 rounded-full bg-warning/15 flex items-center justify-center">
          <ShieldCheck className="h-10 w-10 text-warning" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-h2 font-display text-foreground">Autenticação de Dois Fatores Obrigatória</h2>
          <p className="text-body text-muted-foreground">
            Contas de administrador requerem MFA habilitado para acessar áreas privilegiadas.
            Configure o autenticador de dois fatores antes de prosseguir.
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => navigate('/perfil?tab=seguranca')}
        >
          <ShieldCheck className="h-4 w-4" />
          Configurar MFA agora
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
