/**
 * @fileoverview Hook para gerenciamento de sessões
 * @module hooks/useSession
 */
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface UserSession {
  id: string;
  session_token: string;
  ip_address: string | null;
  user_agent: string | null;
  device_info: Record<string, any> | null;
  location: Record<string, any> | null;
  is_active: boolean;
  last_activity: string;
  expires_at: string;
  created_at: string;
}

// Sessão expira em 24 horas
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
// Refresh a cada 1 hora
const REFRESH_INTERVAL_MS = 60 * 60 * 1000;

export function useSession() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar todas as sessões do usuário
  const fetchSessions = useCallback(async () => {
    if (!user?.id) return [];

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) {
        console.error('Erro ao buscar sessões:', error);
        return [];
      }

      setSessions(data as UserSession[]);
      return data as UserSession[];
    } catch (err) {
      console.error('Erro:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Criar nova sessão
  const createSession = useCallback(async () => {
    if (!user?.id) return null;

    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

    // Obter informações do dispositivo
    const userAgent = navigator.userAgent;
    const deviceInfo = {
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
    };

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_token: sessionToken,
          user_agent: userAgent,
          device_info: deviceInfo,
          is_active: true,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar sessão:', error);
        return null;
      }

      setCurrentSession(data as UserSession);
      
      // Salvar token no localStorage
      localStorage.setItem('session_token', sessionToken);
      
      return data as UserSession;
    } catch (err) {
      console.error('Erro:', err);
      return null;
    }
  }, [user?.id]);

  // Atualizar atividade da sessão (refresh)
  const refreshSession = useCallback(async () => {
    const sessionToken = localStorage.getItem('session_token');
    if (!sessionToken || !user?.id) return false;

    try {
      const newExpiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
      
      const { error } = await supabase
        .from('user_sessions')
        .update({
          last_activity: new Date().toISOString(),
          expires_at: newExpiresAt,
        })
        .eq('session_token', sessionToken)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar sessão:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Erro:', err);
      return false;
    }
  }, [user?.id]);

  // Encerrar sessão específica
  const terminateSession = useCallback(async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (error) {
        toast.error('Erro ao encerrar sessão');
        return false;
      }

      toast.success('Sessão encerrada');
      await fetchSessions();
      return true;
    } catch (err) {
      toast.error('Erro ao encerrar sessão');
      return false;
    }
  }, [fetchSessions]);

  // Encerrar todas as outras sessões
  const terminateAllOtherSessions = useCallback(async () => {
    const sessionToken = localStorage.getItem('session_token');
    if (!user?.id || !sessionToken) return false;

    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .neq('session_token', sessionToken);

      if (error) {
        toast.error('Erro ao encerrar sessões');
        return false;
      }

      toast.success('Todas as outras sessões foram encerradas');
      await fetchSessions();
      return true;
    } catch (err) {
      toast.error('Erro ao encerrar sessões');
      return false;
    }
  }, [user?.id, fetchSessions]);

  // Verificar se sessão atual é válida
  const validateCurrentSession = useCallback(async (): Promise<boolean> => {
    const sessionToken = localStorage.getItem('session_token');
    if (!sessionToken) return false;

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .single();

      if (error || !data) return false;

      // Verificar se expirou
      if (new Date(data.expires_at) < new Date()) {
        await terminateSession(data.id);
        localStorage.removeItem('session_token');
        return false;
      }

      setCurrentSession(data as UserSession);
      return true;
    } catch {
      return false;
    }
  }, [terminateSession]);

  // Auto-refresh da sessão
  useEffect(() => {
    if (!user?.id) return;

    // Validar sessão ao montar
    validateCurrentSession();

    // Configurar refresh automático
    const interval = setInterval(() => {
      refreshSession();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [user?.id, validateCurrentSession, refreshSession]);

  return {
    sessions,
    currentSession,
    isLoading,
    fetchSessions,
    createSession,
    refreshSession,
    terminateSession,
    terminateAllOtherSessions,
    validateCurrentSession,
  };
}
