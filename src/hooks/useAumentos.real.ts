// V17-H049: useAumentos Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aumentoServiceReal } from '@/services/aumentoService.real';
export function useAumentosReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['aumentos', colaboradorId], queryFn: () => aumentoServiceReal.getHistorico(colaboradorId), enabled: !!colaboradorId });
  const concederMutation = useMutation({ mutationFn: ({ salarioAnterior, salarioNovo, motivo, dataVigencia }: any) => aumentoServiceReal.conceder(colaboradorId, salarioAnterior, salarioNovo, motivo, dataVigencia), onSuccess: () => qc.invalidateQueries({ queryKey: ['aumentos', 'colaboradores'] }) });
  return { ...query, conceder: concederMutation.mutateAsync };
}
export default useAumentosReal;
