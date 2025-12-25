import { useRef, useCallback, useEffect } from 'react';
interface Opts { hasMore: boolean; loading: boolean; onLoadMore: () => void; threshold?: number; }
export function useInfiniteScroll({ hasMore, loading, onLoadMore, threshold = 100 }: Opts) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) onLoadMore();
    }, { rootMargin: `${threshold}px` });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, onLoadMore, threshold]);
  useEffect(() => { return () => observerRef.current?.disconnect(); }, []);
  return { loadMoreRef };
}
