/**
 * @fileoverview Hook para re-autenticação em ações sensíveis
 * @module hooks/useReauthentication
 */
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export type SensitiveAction = 
  | 'change_password'
  | 'change_email'
  | 'setup_mfa'
  | 'disable_mfa'
  | 'admin_action'
  | 'delete_account'
  | 'view_sensitive_data';

// Tempo de validade da re-autenticação (5 minutos)
const REAUTH_VALIDITY_MS = 5 * 60 * 1000;

interface ReauthState {
  lastReauthAt: number | null;
  action: SensitiveAction | null;
}

export function useReauthentication() {
  const { user } = useAuth();
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [reauthState, setReauthState] = useState<ReauthState>({
    lastReauthAt: null,
    action: null,
  });

  // Verificar se precisa re-autenticar
  const needsReauthentication = useCallback((action: SensitiveAction): boolean => {
    // Se nunca re-autenticou, precisa
    if (!reauthState.lastReauthAt) return true;

    // Se passou do tempo de validade, precisa
    const timeSinceReauth = Date.now() - reauthState.lastReauthAt;
    if (timeSinceReauth > REAUTH_VALIDITY_MS) return true;

    // Se a ação atual é diferente da anterior, precisa (para ações admin)
    if (action === 'admin_action' && reauthState.action !== 'admin_action') {
      return true;
    }

    return false;
  }, [reauthState]);

  // Re-autenticar com senha
  const reauthenticateWithPassword = useCallback(async (
    password: string,
    action: SensitiveAction
  ): Promise<boolean> => {
    if (!user?.email) {
      toast.error('Usuário não encontrado');
      return false;
    }

    setIsReauthenticating(true);

    try {
      // Tentar fazer login novamente para verificar a senha
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password,
      });

      if (error) {
        toast.error('Senha incorreta');
        
        // Registrar tentativa falha
        await supabase.from('login_attempts').insert({
          email: user.email,
          ip_address: 'unknown', // Seria obtido do backend
          success: false,
          failure_reason: 'reauth_failed',
        });
        
        return false;
      }

      // Atualizar estado de re-autenticação
      setReauthState({
        lastReauthAt: Date.now(),
        action,
      });

      // Registrar no audit log
      await supabase.from('auditoria_logs').insert({
        user_id: user.id,
        user_email: user.email,
        acao: 'REAUTH',
        entidade: 'auth',
        descricao: `Re-autenticação para: ${action}`,
      });

      toast.success('Identidade verificada');
      return true;
    } catch (err) {
      toast.error('Erro ao verificar identidade');
      return false;
    } finally {
      setIsReauthenticating(false);
    }
  }, [user]);

  // Re-autenticar com MFA
  const reauthenticateWithMFA = useCallback(async (
    code: string,
    factorId: string,
    action: SensitiveAction
  ): Promise<boolean> => {
    setIsReauthenticating(true);

    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
      });

      if (error) {
        toast.error('Código MFA inválido');
        return false;
      }

      setReauthState({
        lastReauthAt: Date.now(),
        action,
      });

      toast.success('Identidade verificada com MFA');
      return true;
    } catch (err) {
      toast.error('Erro ao verificar MFA');
      return false;
    } finally {
      setIsReauthenticating(false);
    }
  }, []);

  // Executar ação sensível com verificação
  const executeSecureAction = useCallback(async <T>(
    action: SensitiveAction,
    callback: () => Promise<T>
  ): Promise<{ success: boolean; data?: T; needsReauth?: boolean }> => {
    // Verificar se precisa re-autenticar
    if (needsReauthentication(action)) {
      return { success: false, needsReauth: true };
    }

    try {
      const result = await callback();
      return { success: true, data: result };
    } catch (err) {
      console.error('Erro ao executar ação sensível:', err);
      return { success: false };
    }
  }, [needsReauthentication]);

  // Limpar estado de re-autenticação (logout ou timeout)
  const clearReauthState = useCallback(() => {
    setReauthState({
      lastReauthAt: null,
      action: null,
    });
  }, []);

  // Tempo restante da re-autenticação
  const getTimeRemaining = useCallback((): number => {
    if (!reauthState.lastReauthAt) return 0;
    
    const remaining = REAUTH_VALIDITY_MS - (Date.now() - reauthState.lastReauthAt);
    return Math.max(0, remaining);
  }, [reauthState.lastReauthAt]);

  return {
    isReauthenticating,
    needsReauthentication,
    reauthenticateWithPassword,
    reauthenticateWithMFA,
    executeSecureAction,
    clearReauthState,
    getTimeRemaining,
    isReauthValid: !needsReauthentication('change_password'),
  };
}
