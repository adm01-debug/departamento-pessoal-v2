import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
interface FadeInProps { children: React.ReactNode; delay?: number; duration?: number; className?: string; }
export function FadeIn({ children, delay = 0, duration = 300, className }: FadeInProps) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  return <div className={cn('transition-opacity', show ? 'opacity-100' : 'opacity-0', className)} style={{ transitionDuration: `${duration}ms` }}>{children}</div>;
}
