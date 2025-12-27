import { useRef, useEffect, useCallback } from 'react';
interface InfiniteScrollProps { children: React.ReactNode; onLoadMore: () => void; hasMore: boolean; loading?: boolean; threshold?: number; }
export function InfiniteScroll({ children, onLoadMore, hasMore, loading = false, threshold = 100 }: InfiniteScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const handleScroll = useCallback(() => {
    if (!ref.current || loading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    if (scrollHeight - scrollTop - clientHeight < threshold) onLoadMore();
  }, [loading, hasMore, threshold, onLoadMore]);
  useEffect(() => { const el = ref.current; el?.addEventListener('scroll', handleScroll); return () => el?.removeEventListener('scroll', handleScroll); }, [handleScroll]);
  return <div ref={ref} className="overflow-auto h-full">{children}{loading && <div className="p-4 text-center">Carregando...</div>}</div>;
}
