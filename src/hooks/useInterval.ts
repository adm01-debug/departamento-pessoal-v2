/**
 * @fileoverview Hook para intervalos declarativos
 * @module hooks/useInterval
 */
import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook que executa callback em intervalo regular
 * @param callback - Função a executar
 * @param delay - Intervalo em ms (null para pausar)
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Hook para polling com controle
 */
export function usePolling(
  callback: () => Promise<void>,
  intervalMs: number,
  enabled = true
): { refetch: () => Promise<void> } {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => savedCallback.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);

  const refetch = useCallback(async () => {
    await savedCallback.current();
  }, []);

  return { refetch };
}
