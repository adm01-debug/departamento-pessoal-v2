import { useQuery } from '@tanstack/react-query';
import { desligamentoService } from '@/services/desligamentoService';
import { useEmpresas } from './useEmpresas';

export function useDesligamentos() {
  const { selectedEmpresa } = useEmpresas();
  const empresaId = selectedEmpresa?.id;

  const query = useQuery({
    queryKey: ['desligamentos', empresaId],
    queryFn: () => desligamentoService.listar(empresaId),
    enabled: !!empresaId,
  });

  return {
    desligamentos: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
