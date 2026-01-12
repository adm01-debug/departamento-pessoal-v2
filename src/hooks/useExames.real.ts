// V17-H041: useExames Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exameServiceReal } from '@/services/exameService.real';
export function useExamesReal(colaboradorId?: string, empresaId?: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['exames', colaboradorId], queryFn: () => exameServiceReal.getByColaborador(colaboradorId!), enabled: !!colaboradorId });
  const proximosQuery = useQuery({ queryKey: ['exames-proximos', empresaId], queryFn: () => exameServiceReal.getProximos(empresaId!), enabled: !!empresaId });
  const agendarMutation = useMutation({ mutationFn: ({ tipo, data, clinica }: any) => exameServiceReal.agendar(colaboradorId!, tipo, data, clinica), onSuccess: () => qc.invalidateQueries({ queryKey: ['exames'] }) });
  return { ...query, proximos: proximosQuery.data, agendar: agendarMutation.mutateAsync };
}
export default useExamesReal;
