// V17-H024: useRelatorios Real
import { useMutation, useQuery } from '@tanstack/react-query';
import { relatorioServiceReal } from '@/services/relatorioService.real';
export function useRelatoriosReal(empresaId: string) {
  const historicoQuery = useQuery({ queryKey: ['relatorios-historico', empresaId], queryFn: () => relatorioServiceReal.getHistorico(empresaId), enabled: !!empresaId });
  const gerarMutation = useMutation({ mutationFn: ({ tipo, params }: any) => relatorioServiceReal.gerar(empresaId, tipo, params) });
  const agendarMutation = useMutation({ mutationFn: ({ tipo, periodicidade, email }: any) => relatorioServiceReal.agendar(empresaId, tipo, periodicidade, email) });
  return { historico: historicoQuery.data, gerar: gerarMutation.mutateAsync, agendar: agendarMutation.mutateAsync, isGerando: gerarMutation.isPending };
}
export default useRelatoriosReal;
