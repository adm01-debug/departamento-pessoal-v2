// V17-H035: useTurnos Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { turnoServiceReal } from '@/services/turnoService.real';
export function useTurnosReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['turnos', empresaId], queryFn: () => turnoServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: turnoServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['turnos'] }) });
  return { ...query, create: createMutation.mutateAsync };
}
export default useTurnosReal;
