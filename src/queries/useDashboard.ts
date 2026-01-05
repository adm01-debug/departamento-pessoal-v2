import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/dashboardApi";
export const useDashboardStats = () => useQuery({ queryKey: ["dashboard", "stats"], queryFn: dashboardApi.stats, staleTime: 1000 * 60 * 5 });
export const useDashboardTurnover = (meses?: number) => useQuery({ queryKey: ["dashboard", "turnover", meses], queryFn: () => dashboardApi.turnover(meses) });
export const useDashboardCustos = (meses?: number) => useQuery({ queryKey: ["dashboard", "custos", meses], queryFn: () => dashboardApi.custos(meses) });
export const useDashboardHeadcount = () => useQuery({ queryKey: ["dashboard", "headcount"], queryFn: dashboardApi.headcount });
export const useDashboardAlertas = () => useQuery({ queryKey: ["dashboard", "alertas"], queryFn: dashboardApi.alertas, refetchInterval: 30000 });
export const useDashboardAtividades = () => useQuery({ queryKey: ["dashboard", "atividades"], queryFn: dashboardApi.atividadesRecentes });
