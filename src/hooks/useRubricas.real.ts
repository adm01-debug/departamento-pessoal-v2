// V17-H016: useRubricas Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rubricaServiceReal } from '@/services/rubricaService.real';
export function useRubricasReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['rubricas', empresaId], queryFn: () => rubricaServiceReal.getAll(empresaId), enabled: !!empresaId });
  const proventosQuery = useQuery({ queryKey: ['rubricas-proventos', empresaId], queryFn: () => rubricaServiceReal.getProventos(empresaId), enabled: !!empresaId });
  const descontosQuery = useQuery({ queryKey: ['rubricas-descontos', empresaId], queryFn: () => rubricaServiceReal.getDescontos(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: rubricaServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['rubricas'] }) });
  return { ...query, proventos: proventosQuery.data, descontos: descontosQuery.data, create: createMutation.mutateAsync };
}
export default useRubricasReal;
