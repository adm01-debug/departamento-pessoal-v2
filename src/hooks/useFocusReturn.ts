import { useEffect, useRef } from 'react';
export function useFocusReturn(active: boolean) {
  const returnRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (active) { returnRef.current = document.activeElement as HTMLElement; }
    else if (returnRef.current) { returnRef.current.focus(); returnRef.current = null; }
  }, [active]);
}
