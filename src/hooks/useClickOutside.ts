// V15-136: src/hooks/useClickOutside.ts
import { useEffect, useRef, useCallback, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  enabled = true
): RefObject<T> {
  const ref = useRef<T>(null);

  const handleClick = useCallback((event: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [handleClick, enabled]);

  return ref;
}

export function useClickOutsideMultiple<T extends HTMLElement>(
  refs: RefObject<T>[],
  callback: () => void,
  enabled = true
): void {
  const handleClick = useCallback((event: MouseEvent | TouchEvent) => {
    const clickedOutside = refs.every(ref => 
      ref.current && !ref.current.contains(event.target as Node)
    );
    if (clickedOutside) callback();
  }, [refs, callback]);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [handleClick, enabled]);
}
