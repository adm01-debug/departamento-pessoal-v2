import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LockStatus {
  isLocked: boolean;
  lockedUntil: Date | null;
  remainingSeconds: number;
  attempts: number;
  lockoutMinutes: number;
}

interface UseLoginRateLimitReturn {
  lockStatus: LockStatus | null;
  checkLock: (identifier: string, type?: 'email' | 'ip') => Promise<LockStatus>;
  recordFailedAttempt: (identifier: string, type?: 'email' | 'ip') => Promise<LockStatus>;
  resetAttempts: (identifier: string, type?: 'email' | 'ip') => Promise<void>;
  formatRemainingTime: (seconds: number) => string;
}

export function useLoginRateLimit(): UseLoginRateLimitReturn {
  const [lockStatus, setLockStatus] = useState<LockStatus | null>(null);

  const checkLock = useCallback(async (identifier: string, type: 'email' | 'ip' = 'email'): Promise<LockStatus> => {
    const { data, error } = await supabase.rpc('check_login_lock', {
      p_identifier: identifier,
      p_identifier_type: type
    });

    if (error) {
      console.error('Error checking lock status:', error);
      return { isLocked: false, lockedUntil: null, remainingSeconds: 0, attempts: 0, lockoutMinutes: 0 };
    }

    const result = data?.[0];
    const status: LockStatus = {
      isLocked: result?.is_locked ?? false,
      lockedUntil: result?.locked_until_ts ? new Date(result.locked_until_ts) : null,
      remainingSeconds: result?.remaining_seconds ?? 0,
      attempts: 0,
      lockoutMinutes: Math.ceil((result?.remaining_seconds ?? 0) / 60)
    };

    setLockStatus(status);
    return status;
  }, []);

  const recordFailedAttempt = useCallback(async (identifier: string, type: 'email' | 'ip' = 'email'): Promise<LockStatus> => {
    const { data, error } = await supabase.rpc('record_failed_login', {
      p_identifier: identifier,
      p_identifier_type: type
    });

    if (error) {
      console.error('Error recording failed attempt:', error);
      return { isLocked: false, lockedUntil: null, remainingSeconds: 0, attempts: 0, lockoutMinutes: 0 };
    }

    const result = data?.[0];
    const status: LockStatus = {
      isLocked: result?.is_locked ?? false,
      lockedUntil: result?.locked_until_ts ? new Date(result.locked_until_ts) : null,
      remainingSeconds: result?.locked_until_ts 
        ? Math.max(0, Math.floor((new Date(result.locked_until_ts).getTime() - Date.now()) / 1000))
        : 0,
      attempts: result?.attempts ?? 0,
      lockoutMinutes: result?.lockout_minutes ?? 0
    };

    setLockStatus(status);
    return status;
  }, []);

  const resetAttempts = useCallback(async (identifier: string, type: 'email' | 'ip' = 'email'): Promise<void> => {
    const { error } = await supabase.rpc('reset_login_attempts', {
      p_identifier: identifier,
      p_identifier_type: type
    });

    if (error) {
      console.error('Error resetting attempts:', error);
    }

    setLockStatus(null);
  }, []);

  const formatRemainingTime = useCallback((seconds: number): string => {
    if (seconds <= 0) return '';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }, []);

  return {
    lockStatus,
    checkLock,
    recordFailedAttempt,
    resetAttempts,
    formatRemainingTime
  };
}

export default useLoginRateLimit;
