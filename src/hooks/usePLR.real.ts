// V17-H018: usePLR Real
import { useMutation } from '@tanstack/react-query';
import { plrServiceReal } from '@/services/plrService.real';
export function usePLRReal(empresaId: string) {
  const calcularMutation = useMutation({ mutationFn: ({ valorBase, ano }: any) => plrServiceReal.calcular(empresaId, valorBase, ano) });
  const salvarMutation = useMutation({ mutationFn: ({ ano, pagamentos }: any) => plrServiceReal.salvarPagamento(empresaId, ano, pagamentos) });
  return { calcular: calcularMutation.mutateAsync, salvar: salvarMutation.mutateAsync, resultado: calcularMutation.data };
}
export default usePLRReal;
