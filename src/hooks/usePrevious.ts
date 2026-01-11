// V15-139: src/hooks/usePrevious.ts
import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

export function usePreviousDistinct<T>(value: T, compare?: (a: T, b: T) => boolean): T | undefined {
  const ref = useRef<T>();
  const prevRef = useRef<T>();
  
  const isEqual = compare ?? Object.is;
  
  if (!isEqual(ref.current as T, value)) {
    prevRef.current = ref.current;
    ref.current = value;
  }
  
  return prevRef.current;
}

export function useHasChanged<T>(value: T): boolean {
  const prev = usePrevious(value);
  return prev !== value;
}
