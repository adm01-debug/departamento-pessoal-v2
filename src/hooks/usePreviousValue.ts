/**
 * @fileoverview Hook para acessar valor anterior de uma variável
 * @module hooks/usePreviousValue
 */
import { useRef, useEffect } from 'react';

/**
 * Hook que retorna o valor anterior de uma variável
 * @param value - Valor atual
 * @returns Valor da renderização anterior
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const prevCount = usePreviousValue(count);
 * // prevCount será o valor anterior de count
 * ```
 */
export function usePreviousValue<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Hook que retorna se valor mudou desde última renderização
 * @param value - Valor a monitorar
 * @returns Se o valor mudou
 */
export function useHasChanged<T>(value: T): boolean {
  const prevValue = usePreviousValue(value);
  return prevValue !== value;
}
