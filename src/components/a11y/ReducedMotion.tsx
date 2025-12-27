import { createContext, useContext, useEffect, useState } from 'react';
const ReducedMotionContext = createContext(false);
export const useReducedMotion = () => useContext(ReducedMotionContext);
export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return <ReducedMotionContext.Provider value={prefersReducedMotion}>{children}</ReducedMotionContext.Provider>;
}
