// V17-H046: useOrganograma Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organigramaServiceReal } from '@/services/organigramaService.real';
export function useOrganogramaReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['organograma', empresaId], queryFn: () => organigramaServiceReal.get(empresaId), enabled: !!empresaId });
  const definirGestorMutation = useMutation({ mutationFn: ({ colaboradorId, gestorId }: any) => organigramaServiceReal.definirGestor(colaboradorId, gestorId), onSuccess: () => qc.invalidateQueries({ queryKey: ['organograma'] }) });
  return { ...query, definirGestor: definirGestorMutation.mutateAsync };
}
export default useOrganogramaReal;
