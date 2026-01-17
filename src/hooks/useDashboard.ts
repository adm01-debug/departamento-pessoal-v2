// V18: useDashboard Hook - Formatado e Documentado
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalColaboradores: number;
  colaboradoresAtivos: number;
  admissoesMes: number;
  demissoesMes: number;
  folhaMensal: number;
  feriasProgramadas: number;
  presentesHoje: number;
  turnover: number;
  absenteismo: number;
}

export interface DashboardActivity {
  id: string;
  tipo: string;
  descricao: string;
  data: string;
  usuario: string;
}

export interface DashboardEvent {
  id: string;
  titulo: string;
  data: string;
  tipo: 'ferias' | 'aniversario' | 'admissao' | 'demissao';
  colaborador: string;
}

/**
 * Hook para estatísticas do dashboard
 */
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Colaboradores ativos
      const { count: colaboradoresAtivos } = await supabase
        .from('colaboradores')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo');

      // Total de colaboradores
      const { count: totalColaboradores } = await supabase
        .from('colaboradores')
        .select('*', { count: 'exact', head: true });

      // Férias pendentes
      const { count: feriasProgramadas } = await supabase
        .from('ferias_solicitacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aprovada');

      return {
        totalColaboradores: totalColaboradores || 0,
        colaboradoresAtivos: colaboradoresAtivos || 0,
        admissoesMes: 0,
        demissoesMes: 0,
        folhaMensal: 0,
        feriasProgramadas: feriasProgramadas || 0,
        presentesHoje: colaboradoresAtivos || 0,
        turnover: 0,
        absenteismo: 0,
      };
    },
    refetchInterval: 60000, // Atualiza a cada minuto
    staleTime: 30000,
  });
}

/**
 * Hook para atividades recentes
 */
export function useDashboardActivities() {
  return useQuery<DashboardActivity[]>({
    queryKey: ['dashboard-activities'],
    queryFn: async () => {
      // Por enquanto retorna array vazio
      // TODO: Implementar tabela de audit_logs
      return [];
    },
    staleTime: 60000,
  });
}

/**
 * Hook para eventos do calendário
 */
export function useDashboardEvents() {
  return useQuery<DashboardEvent[]>({
    queryKey: ['dashboard-events'],
    queryFn: async () => {
      const { data: ferias } = await supabase
        .from('ferias_solicitacoes')
        .select('id, data_inicio, colaborador:colaboradores(nome)')
        .eq('status', 'aprovada')
        .limit(10);

      return (ferias || []).map((f: any) => ({
        id: f.id,
        titulo: 'Férias',
        data: f.data_inicio,
        tipo: 'ferias' as const,
        colaborador: f.colaborador?.nome || '',
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para dados de gráficos
 */
export function useDashboardCharts() {
  return useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: async () => {
      return {
        colaboradoresPorDepartamento: [],
        folhaMensal: [],
        turnoverMensal: [],
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default useDashboardStats;
