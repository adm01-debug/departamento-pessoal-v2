/**
 * @fileoverview Hook para timeouts declarativos
 * @module hooks/useTimeout
 */
import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook que executa callback após delay
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

/**
 * Hook para timeout com reset
 */
export function useTimeoutReset(delay: number): [boolean, () => void] {
  const [ready, setReady] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const reset = useCallback(() => {
    setReady(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setReady(true), delay);
  }, [delay]);

  useEffect(() => {
    reset();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reset]);

  return [ready, reset];
}
