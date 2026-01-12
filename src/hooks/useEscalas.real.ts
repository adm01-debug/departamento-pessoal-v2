// V17-H034: useEscalas Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { escalaServiceReal } from '@/services/escalaService.real';
export function useEscalasReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['escalas', empresaId], queryFn: () => escalaServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: escalaServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['escalas'] }) });
  return { ...query, create: createMutation.mutateAsync };
}
export default useEscalasReal;
