// V17-H042: useTreinamentos Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { treinamentoServiceReal } from '@/services/treinamentoService.real';
export function useTreinamentosReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['treinamentos', empresaId], queryFn: () => treinamentoServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: ({ nome, descricao, data, cargaHoraria }: any) => treinamentoServiceReal.criar(empresaId, nome, descricao, data, cargaHoraria), onSuccess: () => qc.invalidateQueries({ queryKey: ['treinamentos'] }) });
  const inscreverMutation = useMutation({ mutationFn: ({ treinamentoId, colaboradorId }: any) => treinamentoServiceReal.inscrever(treinamentoId, colaboradorId), onSuccess: () => qc.invalidateQueries({ queryKey: ['treinamentos'] }) });
  return { ...query, create: createMutation.mutateAsync, inscrever: inscreverMutation.mutateAsync };
}
export default useTreinamentosReal;
