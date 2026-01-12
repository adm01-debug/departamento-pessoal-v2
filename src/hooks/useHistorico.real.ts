// V17-H036: useHistorico Real
import { useQuery, useMutation } from '@tanstack/react-query';
import { historicoServiceReal } from '@/services/historicoService.real';
export function useHistoricoReal(colaboradorId: string) {
  const query = useQuery({ queryKey: ['historico', colaboradorId], queryFn: () => historicoServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const registrarMutation = useMutation({ mutationFn: ({ tipo, valorAnterior, valorNovo, usuarioId }: any) => historicoServiceReal.registrar(colaboradorId, tipo, valorAnterior, valorNovo, usuarioId) });
  return { ...query, registrar: registrarMutation.mutateAsync };
}
export default useHistoricoReal;
