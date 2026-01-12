// V17-H014: useGuias Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guiasServiceReal } from '@/services/guiasService.real';
export function useGuiasReal(empresaId: string, competencia: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['guias', empresaId, competencia], queryFn: () => guiasServiceReal.getByCompetencia(empresaId, competencia), enabled: !!(empresaId && competencia) });
  const gerarMutation = useMutation({ mutationFn: ({ tipo, valor }: any) => guiasServiceReal.gerar(empresaId, competencia, tipo, valor), onSuccess: () => qc.invalidateQueries({ queryKey: ['guias'] }) });
  const pagarMutation = useMutation({ mutationFn: ({ guiaId, dataPagamento }: any) => guiasServiceReal.marcarPaga(guiaId, dataPagamento), onSuccess: () => qc.invalidateQueries({ queryKey: ['guias'] }) });
  return { ...query, gerar: gerarMutation.mutateAsync, pagar: pagarMutation.mutateAsync };
}
export default useGuiasReal;
