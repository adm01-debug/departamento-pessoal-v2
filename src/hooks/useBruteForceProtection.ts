import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LockState {
  isLocked: boolean;
  remainingSeconds: number;
  attempts: number;
}

export function useBruteForceProtection() {
  const [lockState, setLockState] = useState<LockState>({
    isLocked: false,
    remainingSeconds: 0,
    attempts: 0,
  });

  const checkLock = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_login_lock', {
        p_identifier: email,
        p_identifier_type: 'email',
      });
      if (error || !data || data.length === 0) return false;
      const record = data[0];
      if (record.is_locked) {
        setLockState({
          isLocked: true,
          remainingSeconds: record.remaining_seconds ?? 0,
          attempts: 0,
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const recordFailedAttempt = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase.rpc('record_failed_login', {
        p_identifier: email,
        p_identifier_type: 'email',
      });
      if (error || !data || data.length === 0) return;
      const record = data[0];
      setLockState({
        isLocked: record.is_locked ?? false,
        remainingSeconds: record.lockout_minutes ? record.lockout_minutes * 60 : 0,
        attempts: record.attempts ?? 0,
      });
    } catch {
      // silently fail
    }
  }, []);

  const resetAttempts = useCallback(async (email: string) => {
    try {
      await supabase.rpc('reset_login_attempts', {
        p_identifier: email,
        p_identifier_type: 'email',
      });
      setLockState({ isLocked: false, remainingSeconds: 0, attempts: 0 });
    } catch {
      // silently fail
    }
  }, []);

  return { lockState, checkLock, recordFailedAttempt, resetAttempts };
}
