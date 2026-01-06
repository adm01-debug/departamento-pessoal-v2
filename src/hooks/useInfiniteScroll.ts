import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface InfiniteScrollOptions<T> {
  pageSize?: number;
  orderBy?: { column: keyof T; ascending?: boolean };
  filters?: Record<string, unknown>;
  select?: string;
  enabled?: boolean;
}

export interface UseInfiniteScrollResult<T> {
  data: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  totalCount: number;
  error: Error | null;
  loadMoreRef: (node: HTMLElement | null) => void;
}

export function useInfiniteScroll<T extends Record<string, unknown>>(
  tableName: string,
  options: InfiniteScrollOptions<T> = {}
): UseInfiniteScrollResult<T> {
  const { pageSize = 20, orderBy, filters = {}, select = '*', enabled = true } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error } =
    useInfiniteQuery({
      queryKey: ['infinite', tableName, filters, orderBy, pageSize],
      queryFn: async ({ pageParam = 0 }) => {
        let query = supabase
          .from(tableName)
          .select(select, { count: 'exact' })
          .range(pageParam * pageSize, (pageParam + 1) * pageSize - 1);

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
          }
        });

        if (orderBy) {
          query = query.order(orderBy.column as string, {
            ascending: orderBy.ascending ?? true,
          });
        }

        const { data, error, count } = await query;

        if (error) throw error;

        return {
          items: data as T[],
          nextPage: pageParam + 1,
          totalCount: count ?? 0,
          hasMore: (data?.length ?? 0) === pageSize,
        };
      },
      getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
      initialPageParam: 0,
      enabled,
    });

  const allData = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const loadMoreRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading || isFetchingNextPage) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    data: allData,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    refetch,
    totalCount,
    error: error as Error | null,
    loadMoreRef,
  };
}

export function useVirtualScroll<T>(items: T[], itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    offsetY,
    totalHeight,
    handleScroll,
    startIndex,
    endIndex,
  };
}
