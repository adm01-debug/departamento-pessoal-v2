// V17-H040: useAtestados Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { atestadoServiceReal } from '@/services/atestadoService.real';
export function useAtestadosReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['atestados', colaboradorId], queryFn: () => atestadoServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const createMutation = useMutation({ mutationFn: ({ cid, dataInicio, dataFim, medico, crm }: any) => atestadoServiceReal.registrar(colaboradorId, cid, dataInicio, dataFim, medico, crm), onSuccess: () => qc.invalidateQueries({ queryKey: ['atestados'] }) });
  return { ...query, create: createMutation.mutateAsync };
}
export default useAtestadosReal;
