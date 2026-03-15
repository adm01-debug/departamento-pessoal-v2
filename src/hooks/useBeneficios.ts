import { useQuery } from '@tanstack/react-query';
import { beneficioService } from '@/services';
import { useEmpresas } from './useEmpresas';

export function useBeneficios() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;

  const query = useQuery({
    queryKey: ['beneficios', empresaId],
    queryFn: () => beneficioService.list(empresaId),
    enabled: !!empresaId,
  });

  return {
    beneficios: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
