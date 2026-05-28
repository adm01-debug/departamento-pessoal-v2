import { useState, useCallback } from 'react';

interface LockState {
  isLocked: boolean;
  remainingSeconds: number;
  attempts: number;
}

/**
 * Proteção anti-brute-force.
 *
 * Atualmente é um no-op porque as funções `check_login_lock` e
 * `record_failed_login` ainda não existem no banco corporativo
 * (Supabase externo). Quando essas RPCs forem criadas no banco da
 * empresa, basta restaurar as chamadas `supabase.rpc(...)` aqui.
 */
export function useBruteForceProtection() {
  const [lockState] = useState<LockState>({
    isLocked: false,
    remainingSeconds: 0,
    attempts: 0,
  });

  const checkLock = useCallback(async (_email: string): Promise<boolean> => false, []);
  const recordFailedAttempt = useCallback(async (_email: string) => {}, []);
  const resetAttempts = useCallback(async (_email: string) => {}, []);

  return { lockState, checkLock, recordFailedAttempt, resetAttempts };
}
