import { dashboardApi } from "@/api/dashboardApi";
import { useQuery } from "@tanstack/react-query";
export const useDashboardStats = () => useQuery({ queryKey: ["dashboard", "stats"], queryFn: dashboardApi.stats, staleTime: 1000 * 60 * 5 });
export const useTurnover = (meses: number = 12) => useQuery({ queryKey: ["dashboard", "turnover", meses], queryFn: () => dashboardApi.turnover(meses) });
export const useCustos = (meses: number = 12) => useQuery({ queryKey: ["dashboard", "custos", meses], queryFn: () => dashboardApi.custos(meses) });
export const useHeadcount = () => useQuery({ queryKey: ["dashboard", "headcount"], queryFn: dashboardApi.headcount });
export const useDistribuicaoSalarial = () => useQuery({ queryKey: ["dashboard", "distribuicao-salarial"], queryFn: dashboardApi.distribuicaoSalarial });
export const useAlertas = () => useQuery({ queryKey: ["dashboard", "alertas"], queryFn: dashboardApi.alertas });
export const useAtividadesRecentes = () => useQuery({ queryKey: ["dashboard", "atividades"], queryFn: dashboardApi.atividadesRecentes });
