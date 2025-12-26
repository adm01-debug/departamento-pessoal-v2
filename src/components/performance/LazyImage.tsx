import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> { placeholder?: string; threshold?: number; }
export function LazyImage({ src, alt, className, placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', threshold = 0.1, ...props }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return <img ref={ref} src={inView ? src : placeholder} alt={alt} className={cn('transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0', className)} onLoad={() => setLoaded(true)} {...props} />;
}
