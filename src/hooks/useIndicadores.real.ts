// V17-H027: useIndicadores Real
import { useQuery } from '@tanstack/react-query';
import { kpiServiceReal } from '@/services/kpiService.real';
export function useIndicadoresReal(empresaId: string, periodo?: { inicio: string; fim: string }) {
  const turnoverQuery = useQuery({ queryKey: ['kpi-turnover', empresaId, periodo], queryFn: () => kpiServiceReal.calcularTurnover(empresaId, periodo!), enabled: !!(empresaId && periodo) });
  const headcountQuery = useQuery({ queryKey: ['kpi-headcount', empresaId], queryFn: () => kpiServiceReal.calcularHeadcount(empresaId), enabled: !!empresaId });
  return { turnover: turnoverQuery.data, headcount: headcountQuery.data };
}
export default useIndicadoresReal;
