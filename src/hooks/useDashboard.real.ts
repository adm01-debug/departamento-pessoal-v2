// V17-H026: useDashboard Real
import { useQuery } from '@tanstack/react-query';
import { dashboardServiceReal } from '@/services/dashboardService.real';
export function useDashboardReal(empresaId: string, competencia?: string) {
  const resumoQuery = useQuery({ queryKey: ['dashboard-resumo', empresaId], queryFn: () => dashboardServiceReal.getResumo(empresaId), enabled: !!empresaId });
  const custoQuery = useQuery({ queryKey: ['dashboard-custo', empresaId, competencia], queryFn: () => dashboardServiceReal.getCustoFolha(empresaId, competencia!), enabled: !!(empresaId && competencia) });
  const indicadoresQuery = useQuery({ queryKey: ['dashboard-indicadores', empresaId], queryFn: () => dashboardServiceReal.getIndicadores(empresaId), enabled: !!empresaId });
  return { resumo: resumoQuery.data, custoFolha: custoQuery.data, indicadores: indicadoresQuery.data, isLoading: resumoQuery.isLoading };
}
export default useDashboardReal;
