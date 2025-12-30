/**
 * @fileoverview Hook para logging de erros
 * @module hooks/useErrorLogger
 */
import { useCallback } from 'react';
import { logger } from '@/lib/logger';

export function useErrorLogger(context?: string) {
  const logError = useCallback((error: Error | unknown, extra?: Record<string, any>) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error(`[${context || 'App'}] ${errorObj.message}`, { error: errorObj, ...extra });
  }, [context]);

  const logWarning = useCallback((message: string, extra?: Record<string, any>) => {
    logger.warn(`[${context || 'App'}] ${message}`, extra);
  }, [context]);

  const logInfo = useCallback((message: string, extra?: Record<string, any>) => {
    logger.info(`[${context || 'App'}] ${message}`, extra);
  }, [context]);

  return { logError, logWarning, logInfo };
}

export default useErrorLogger;
