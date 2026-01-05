import { useColaboradores, useColaboradoresAtivos } from "./colaboradoresQueries";
import { useDashboardStats, useAlertas } from "./dashboardQueries";
import { useFeriasVencidas } from "./feriasQueries";
import { useInconsistenciasPonto } from "./pontoQueries";
import { useEventosPendentes } from "./esocialQueries";
export function useDashboardData() {
  const stats = useDashboardStats();
  const alertas = useAlertas();
  const feriasVencidas = useFeriasVencidas();
  const eventosPendentes = useEventosPendentes();
  const isLoading = stats.isLoading || alertas.isLoading;
  const error = stats.error || alertas.error;
  return { stats: stats.data, alertas: alertas.data, feriasVencidas: feriasVencidas.data, eventosPendentes: eventosPendentes.data, isLoading, error };
}
