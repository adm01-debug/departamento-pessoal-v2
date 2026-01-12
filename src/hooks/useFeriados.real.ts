// V17-H033: useFeriados Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feriadoServiceReal } from '@/services/feriadoService.real';
export function useFeriadosReal(empresaId?: string, ano?: number) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['feriados', empresaId, ano], queryFn: () => ano ? feriadoServiceReal.getByAno(ano, empresaId) : feriadoServiceReal.getAll(empresaId) });
  const createMutation = useMutation({ mutationFn: feriadoServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['feriados'] }) });
  const deleteMutation = useMutation({ mutationFn: feriadoServiceReal.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['feriados'] }) });
  return { ...query, create: createMutation.mutateAsync, remove: deleteMutation.mutateAsync };
}
export default useFeriadosReal;
