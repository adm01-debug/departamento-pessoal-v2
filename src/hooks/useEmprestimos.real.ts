// V17-H060: useEmprestimos Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emprestimoServiceReal } from '@/services/emprestimoService.real';
export function useEmprestimosReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['emprestimos', colaboradorId], queryFn: () => emprestimoServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const createMutation = useMutation({ mutationFn: ({ valorTotal, parcelas, parcelaValor }: any) => emprestimoServiceReal.criar(colaboradorId, valorTotal, parcelas, parcelaValor), onSuccess: () => qc.invalidateQueries({ queryKey: ['emprestimos'] }) });
  const registrarParcelaMutation = useMutation({ mutationFn: emprestimoServiceReal.registrarParcela, onSuccess: () => qc.invalidateQueries({ queryKey: ['emprestimos'] }) });
  return { ...query, create: createMutation.mutateAsync, registrarParcela: registrarParcelaMutation.mutateAsync };
}
export default useEmprestimosReal;
