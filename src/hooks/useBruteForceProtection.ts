import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LockState {
  isLocked: boolean;
  remainingSeconds: number;
  attempts: number;
}

const INITIAL: LockState = { isLocked: false, remainingSeconds: 0, attempts: 0 };

/**
 * Proteção anti-brute-force baseada nas RPCs:
 *  - check_login_lock(p_identifier, p_identifier_type)
 *  - record_failed_login(p_identifier, p_identifier_type)
 *  - reset_login_attempts(p_identifier, p_identifier_type)
 *
 * Regras (server-side): a partir de 5 falhas o identificador é bloqueado
 * por 5 minutos; 7 => 15 min; 10+ => 60 min.
 */
export function useBruteForceProtection() {
  const [lockState, setLockState] = useState<LockState>(INITIAL);

  const checkLock = useCallback(async (email: string): Promise<boolean> => {
    if (!email) return false;
    try {
      const { data, error } = await supabase.rpc('check_login_lock', {
        p_identifier: email.toLowerCase(),
        p_identifier_type: 'email',
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      const locked = Boolean(row?.is_locked);
      const remaining = Number(row?.remaining_seconds ?? 0);
      setLockState((s) => ({ ...s, isLocked: locked, remainingSeconds: remaining }));
      return locked;
    } catch (e) {
      console.error('[bruteForce] checkLock falhou:', e);
      return false; // fail-open apenas na CHECAGEM pré-login
    }
  }, []);

  const recordFailedAttempt = useCallback(async (email: string) => {
    if (!email) return;
    try {
      const { data, error } = await supabase.rpc('record_failed_login', {
        p_identifier: email.toLowerCase(),
        p_identifier_type: 'email',
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      setLockState({
        attempts: Number(row?.attempts ?? 0),
        isLocked: Boolean(row?.is_locked),
        remainingSeconds: Number(row?.lockout_minutes ?? 0) * 60,
      });
    } catch (e) {
      console.error('[bruteForce] recordFailedAttempt falhou:', e);
    }
  }, []);

  const resetAttempts = useCallback(async (email: string) => {
    if (!email) return;
    try {
      const { error } = await supabase.rpc('reset_login_attempts', {
        p_identifier: email.toLowerCase(),
        p_identifier_type: 'email',
      });
      if (error) throw error;
      setLockState(INITIAL);
    } catch (e) {
      console.error('[bruteForce] resetAttempts falhou:', e);
    }
  }, []);

  return { lockState, checkLock, recordFailedAttempt, resetAttempts };
}
