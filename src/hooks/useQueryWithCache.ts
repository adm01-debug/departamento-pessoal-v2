import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CACHE_TIMES } from '@/lib/constants';

/**
 * Hook wrapper para useQuery com cache otimizado
 */
export function useQueryWithCache<TData, TError = Error>(
  key: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn,
    staleTime: CACHE_TIMES.STALE_TIME,
    gcTime: CACHE_TIMES.GC_TIME,
    ...options,
  });
}

/**
 * Hook para dados que mudam pouco (ex: departamentos, cargos)
 */
export function useStaticQuery<TData, TError = Error>(
  key: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn,
    staleTime: 30 * 60 * 1000, // 30 minutos
    gcTime: 60 * 60 * 1000, // 1 hora
    ...options,
  });
}

/**
 * Hook para dados que mudam frequentemente (ex: notificações)
 */
export function useLiveQuery<TData, TError = Error>(
  key: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 60 * 1000, // Refetch a cada 1 minuto
    ...options,
  });
}

export default useQueryWithCache;
