import { useState, useRef, useCallback, RefObject } from 'react';
export function useHover<T extends HTMLElement>(): [RefObject<T>, boolean] {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const callbackRef = useCallback((node: T | null) => {
    if (ref.current) { ref.current.removeEventListener('mouseenter', handleMouseEnter); ref.current.removeEventListener('mouseleave', handleMouseLeave); }
    if (node) { node.addEventListener('mouseenter', handleMouseEnter); node.addEventListener('mouseleave', handleMouseLeave); }
    (ref as any).current = node;
  }, [handleMouseEnter, handleMouseLeave]);
  return [{ current: ref.current } as RefObject<T>, isHovered];
}
