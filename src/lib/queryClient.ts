import { QueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

/**
 * Configuração global otimizada do React Query
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 30 * 60 * 1000, // 30 minutos (antigo cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      onError: (error: Error) => {
        toast({
          title: 'Erro',
          description: error.message || 'Ocorreu um erro inesperado',
          variant: 'destructive',
        });
      },
    },
  },
});

/**
 * Invalidar queries por prefixo
 */
export const invalidateQueries = (prefix: string): Promise<void> => {
  return queryClient.invalidateQueries({ queryKey: [prefix] });
};

/**
 * Pré-carregar dados
 */
export const prefetchQuery = async <T>(
  key: string[],
  fn: () => Promise<T>
): Promise<void> => {
  await queryClient.prefetchQuery({ queryKey: key, queryFn: fn });
};

/**
 * Limpar cache
 */
export const clearQueryCache = (): void => {
  queryClient.clear();
};

export default queryClient;
