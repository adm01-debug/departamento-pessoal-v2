import { useQuery } from '@tanstack/react-query';
import { feriasService } from '@/services';
import { useEmpresas } from './useEmpresas';

export function useFerias() {
  const { selectedEmpresa } = useEmpresas();
  const empresaId = selectedEmpresa?.id;

  const query = useQuery({
    queryKey: ['ferias', empresaId],
    queryFn: () => feriasService.listSolicitacoes(empresaId),
    enabled: !!empresaId,
  });

  return {
    ferias: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
