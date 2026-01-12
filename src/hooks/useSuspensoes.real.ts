// V17-H048: useSuspensoes Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suspensaoServiceReal } from '@/services/suspensaoService.real';
export function useSuspensoesReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['suspensoes', colaboradorId], queryFn: () => suspensaoServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const aplicarMutation = useMutation({ mutationFn: ({ dataInicio, dataFim, motivo }: any) => suspensaoServiceReal.aplicar(colaboradorId, dataInicio, dataFim, motivo), onSuccess: () => qc.invalidateQueries({ queryKey: ['suspensoes'] }) });
  return { ...query, aplicar: aplicarMutation.mutateAsync };
}
export default useSuspensoesReal;
