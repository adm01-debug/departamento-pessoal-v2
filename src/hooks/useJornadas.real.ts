// V17-H010: useJornadas Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jornadaServiceReal } from '@/services/jornadaService.real';
export function useJornadasReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['jornadas', empresaId], queryFn: () => jornadaServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: jornadaServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['jornadas'] }) });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: any) => jornadaServiceReal.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['jornadas'] }) });
  return { ...query, create: createMutation.mutateAsync, update: updateMutation.mutateAsync };
}
export default useJornadasReal;
