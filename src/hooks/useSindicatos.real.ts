// V17-H032: useSindicatos Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sindicatoServiceReal } from '@/services/sindicatoService.real';
export function useSindicatosReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['sindicatos', empresaId], queryFn: () => sindicatoServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: sindicatoServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['sindicatos'] }) });
  return { ...query, create: createMutation.mutateAsync };
}
export default useSindicatosReal;
