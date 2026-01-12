// V17-H007: useDependentes Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dependenteServiceReal } from '@/services/dependenteService.real';
export function useDependentesReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['dependentes', colaboradorId], queryFn: () => dependenteServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const createMutation = useMutation({ mutationFn: dependenteServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['dependentes'] }) });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: any) => dependenteServiceReal.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['dependentes'] }) });
  const deleteMutation = useMutation({ mutationFn: dependenteServiceReal.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['dependentes'] }) });
  return { ...query, create: createMutation.mutateAsync, update: updateMutation.mutateAsync, remove: deleteMutation.mutateAsync };
}
export default useDependentesReal;
