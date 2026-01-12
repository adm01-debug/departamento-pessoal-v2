// V17-H039: useAdvertencias Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { advertenciaServiceReal } from '@/services/advertenciaService.real';
export function useAdvertenciasReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['advertencias', colaboradorId], queryFn: () => advertenciaServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const createMutation = useMutation({ mutationFn: ({ motivo, tipo, descricao }: any) => advertenciaServiceReal.criar(colaboradorId, motivo, tipo, descricao), onSuccess: () => qc.invalidateQueries({ queryKey: ['advertencias'] }) });
  return { ...query, create: createMutation.mutateAsync };
}
export default useAdvertenciasReal;
