import { useEffect, useState } from 'react';
interface LiveRegionProps { message: string; priority?: 'polite' | 'assertive'; clearAfter?: number; }
export function LiveRegion({ message, priority = 'polite', clearAfter = 5000 }: LiveRegionProps) {
  const [content, setContent] = useState(message);
  useEffect(() => { setContent(message); if (clearAfter > 0) { const t = setTimeout(() => setContent(''), clearAfter); return () => clearTimeout(t); } }, [message, clearAfter]);
  return <div aria-live={priority} aria-atomic="true" className="sr-only">{content}</div>;
}
