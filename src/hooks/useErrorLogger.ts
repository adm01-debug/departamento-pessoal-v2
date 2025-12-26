import { useCallback } from 'react';
export function useErrorLogger() {
  const log = useCallback((error: Error, context?: Record<string, any>) => { console.error('[ErrorLogger]', error.message, context); }, []);
  const logWarning = useCallback((message: string, context?: Record<string, any>) => { console.warn('[WarningLogger]', message, context); }, []);
  return { log, logWarning };
}
