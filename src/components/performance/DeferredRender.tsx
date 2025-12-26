import { useState, useEffect } from 'react';
interface DeferredRenderProps { children: React.ReactNode; delay?: number; fallback?: React.ReactNode; }
export function DeferredRender({ children, delay = 0, fallback = null }: DeferredRenderProps) {
  const [shouldRender, setShouldRender] = useState(delay === 0);
  useEffect(() => { if (delay > 0) { const timer = setTimeout(() => setShouldRender(true), delay); return () => clearTimeout(timer); } }, [delay]);
  return <>{shouldRender ? children : fallback}</>;
}
