import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface InfiniteScrollProps {
  children: React.ReactNode;
  className?: string;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  loadingComponent?: React.ReactNode;
  endMessage?: React.ReactNode;
  onLoadMore: () => void;
}

export function InfiniteScroll({ children, className, hasMore, isLoading, threshold = 100, loadingComponent, endMessage, onLoadMore }: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading) onLoadMore();
  }, [hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, { rootMargin: `${threshold}px` });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [handleObserver, threshold]);

  return (
    <div className={cn("relative", className)}>
      {children}
      <div ref={loadMoreRef} className="h-1" />
      {isLoading && (loadingComponent || <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>)}
      {!hasMore && !isLoading && endMessage}
    </div>
  );
}
export default InfiniteScroll;
