import { useQuery } from '@tanstack/react-query';
import { desligamentoService } from '@/services/desligamentoService';
import { useEmpresas } from './useEmpresas';

export function useDesligamentos() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;

  const query = useQuery({
    queryKey: ['desligamentos', empresaId],
    queryFn: () => desligamentoService.listar(empresaId),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5min cache
    gcTime: 10 * 60 * 1000,   // 10min garbage collection
    refetchOnWindowFocus: false,
  });

  return {
    desligamentos: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
