// V17-H050: useVinculos Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vinculoServiceReal } from '@/services/vinculoService.real';
export function useVinculosReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['vinculos', colaboradorId], queryFn: () => vinculoServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const createMutation = useMutation({ mutationFn: vinculoServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['vinculos'] }) });
  return { ...query, create: createMutation.mutateAsync };
}
export default useVinculosReal;
