import React from "react";
import { cn } from "@/lib/utils";

interface LazyLoadProps { onLoadMore: () => void; hasMore: boolean; loading?: boolean; children: React.ReactNode; className?: string; }

export function LazyLoad({ onLoadMore, hasMore, loading, children, className }: LazyLoadProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && hasMore && !loading) onLoadMore(); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);
  return (<div className={className}>{children}<div ref={ref} className="h-4" />{loading && <p className="text-center text-muted-foreground py-4">Carregando...</p>}</div>);
}
export default LazyLoad;
