// V19-002: Hook de Otimizacao de Queries
import { useCallback, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface QueryOptimizerConfig {
  staleTime?: number;
  cacheTime?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
}

const defaultConfig: QueryOptimizerConfig = {
  staleTime: 5 * 60 * 1000, // 5 min
  cacheTime: 30 * 60 * 1000, // 30 min
  refetchOnMount: false,
  refetchOnWindowFocus: false,
};

export function useQueryOptimizer(queryKey: string[], config?: QueryOptimizerConfig) {
  const queryClient = useQueryClient();
  const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);
  const lastFetch = useRef<number>(0);

  const prefetch = useCallback(async <T>(fetcher: () => Promise<T>) => {
    const now = Date.now();
    if (now - lastFetch.current < mergedConfig.staleTime!) return;
    lastFetch.current = now;
    await queryClient.prefetchQuery({ queryKey, queryFn: fetcher, staleTime: mergedConfig.staleTime });
  }, [queryClient, queryKey, mergedConfig.staleTime]);

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const setData = useCallback(<T>(data: T) => {
    queryClient.setQueryData(queryKey, data);
  }, [queryClient, queryKey]);

  const getData = useCallback(<T>(): T | undefined => {
    return queryClient.getQueryData<T>(queryKey);
  }, [queryClient, queryKey]);

  return { prefetch, invalidate, setData, getData, config: mergedConfig };
}

// Batch invalidation
export function useBatchInvalidate() {
  const queryClient = useQueryClient();
  return useCallback((keys: string[][]) => {
    keys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
  }, [queryClient]);
}

export default useQueryOptimizer;
