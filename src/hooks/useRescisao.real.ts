// V17-H004: useRescisao Real
import { useMutation } from '@tanstack/react-query';
import { rescisaoServiceReal } from '@/services/rescisaoService.real';
export function useRescisaoReal() {
  const calcularMutation = useMutation({ mutationFn: rescisaoServiceReal.calcular });
  const salvarMutation = useMutation({ mutationFn: ({ demissaoId, rescisao }: any) => rescisaoServiceReal.salvar(demissaoId, rescisao) });
  return { calcular: calcularMutation.mutateAsync, salvar: salvarMutation.mutateAsync, isCalculating: calcularMutation.isPending, resultado: calcularMutation.data };
}
export default useRescisaoReal;
