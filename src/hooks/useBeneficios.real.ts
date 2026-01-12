// V17-H019: useBeneficios Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { beneficiosServiceReal } from '@/services/beneficiosService.real';
export function useBeneficiosReal(empresaId?: string, colaboradorId?: string) {
  const qc = useQueryClient();
  const allQuery = useQuery({ queryKey: ['beneficios', empresaId], queryFn: () => beneficiosServiceReal.getAll(empresaId!), enabled: !!empresaId });
  const colaboradorQuery = useQuery({ queryKey: ['beneficios-colaborador', colaboradorId], queryFn: () => beneficiosServiceReal.getByColaborador(colaboradorId!), enabled: !!colaboradorId });
  const atribuirMutation = useMutation({ mutationFn: ({ colaboradorId, beneficioId, valorDesconto }: any) => beneficiosServiceReal.atribuir(colaboradorId, beneficioId, valorDesconto), onSuccess: () => qc.invalidateQueries({ queryKey: ['beneficios'] }) });
  return { todos: allQuery.data, doColaborador: colaboradorQuery.data, atribuir: atribuirMutation.mutateAsync };
}
export default useBeneficiosReal;
