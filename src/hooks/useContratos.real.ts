// V17-H009: useContratos Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contratoServiceReal } from '@/services/contratoService.real';
export function useContratosReal(empresaId?: string, colaboradorId?: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['contratos', empresaId || colaboradorId], queryFn: () => empresaId ? contratoServiceReal.getAll(empresaId) : contratoServiceReal.getByColaborador(colaboradorId!), enabled: !!(empresaId || colaboradorId) });
  const createMutation = useMutation({ mutationFn: contratoServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['contratos'] }) });
  const renovarMutation = useMutation({ mutationFn: ({ id, novaDataFim }: any) => contratoServiceReal.renovar(id, novaDataFim), onSuccess: () => qc.invalidateQueries({ queryKey: ['contratos'] }) });
  return { ...query, create: createMutation.mutateAsync, renovar: renovarMutation.mutateAsync };
}
export default useContratosReal;
