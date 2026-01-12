// V17-H020: useVales Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { valeTransporteServiceReal } from '@/services/valeTransporteService.real';
import { valeAlimentacaoServiceReal } from '@/services/valeAlimentacaoService.real';
export function useValesReal(colaboradorId: string) {
  const qc = useQueryClient();
  const vtQuery = useQuery({ queryKey: ['vale-transporte', colaboradorId], queryFn: () => valeTransporteServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const vaQuery = useQuery({ queryKey: ['vale-alimentacao', colaboradorId], queryFn: () => valeAlimentacaoServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const configurarVTMutation = useMutation({ mutationFn: ({ valorPassagem, diasUteis }: any) => valeTransporteServiceReal.configurar(colaboradorId, valorPassagem, diasUteis), onSuccess: () => qc.invalidateQueries({ queryKey: ['vale-transporte'] }) });
  const configurarVAMutation = useMutation({ mutationFn: ({ valorDia, diasUteis, tipo }: any) => valeAlimentacaoServiceReal.configurar(colaboradorId, valorDia, diasUteis, tipo), onSuccess: () => qc.invalidateQueries({ queryKey: ['vale-alimentacao'] }) });
  return { vt: vtQuery.data, va: vaQuery.data, configurarVT: configurarVTMutation.mutateAsync, configurarVA: configurarVAMutation.mutateAsync };
}
export default useValesReal;
