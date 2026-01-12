// V17-H031: useLotacoes Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lotacaoServiceReal } from '@/services/lotacaoService.real';
export function useLotacoesReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['lotacoes', empresaId], queryFn: () => lotacaoServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: lotacaoServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['lotacoes'] }) });
  return { ...query, create: createMutation.mutateAsync };
}
export default useLotacoesReal;
