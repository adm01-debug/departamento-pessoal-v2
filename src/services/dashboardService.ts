// V18: DashboardService - Usando Supabase
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export interface DashboardStats {
  colaboradoresAtivos: number;
  totalColaboradores: number;
  feriasPendentes: number;
  folhaMensal: number;
  admissoesMes: number;
  demissoesMes: number;
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

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    // Colaboradores ativos
    const { count: colaboradoresAtivos } = await supabase
      .from('colaboradores')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativo');

    // Total colaboradores
    const { count: totalColaboradores } = await supabase
      .from('colaboradores')
      .select('*', { count: 'exact', head: true });

    // Férias pendentes
    const { count: feriasPendentes } = await supabase
      .from('ferias_solicitacoes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pendente');

    return {
      colaboradoresAtivos: colaboradoresAtivos || 0,
      totalColaboradores: totalColaboradores || 0,
      feriasPendentes: feriasPendentes || 0,
      folhaMensal: 0,
      admissoesMes: 0,
      demissoesMes: 0,
      turnover: 0,
      absenteismo: 0,
    };
  },

  async getActivities(limit = 10): Promise<DashboardActivity[]> {
    // TODO: Implementar tabela audit_logs
    return [];
  },

  async getEvents(days = 30) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + days);

    const { data: ferias } = await supabase
      .from('ferias_solicitacoes')
      .select('id, data_inicio, colaborador:colaboradores(nome)')
      .eq('status', 'aprovada')
      .lte('data_inicio', dataLimite.toISOString())
      .limit(20);

    return (ferias || []).map((f: any) => ({
      id: f.id,
      tipo: 'ferias',
      titulo: `Férias - ${f.colaborador?.nome || 'Colaborador'}`,
      data: f.data_inicio,
    }));
  },

  async getCharts() {
    // Colaboradores por departamento
    const { data: porDepartamento } = await supabase
      .from('colaboradores')
      .select('departamento_id, departamento:departamentos(nome)')
      .eq('status', 'ativo');

    const departamentos: Record<string, number> = {};
    (porDepartamento || []).forEach((c: any) => {
      const nome = c.departamento?.nome || 'Sem departamento';
      departamentos[nome] = (departamentos[nome] || 0) + 1;
    });

    return {
      colaboradoresPorDepartamento: Object.entries(departamentos).map(([nome, valor]) => ({
        nome,
        valor,
      })),
      folhaMensal: [],
      turnoverMensal: [],
    };
  },

  async getAlerts() {
    const alertas = [];

    // Férias vencendo
    const { count: feriasVencendo } = await supabase
      .from('colaboradores')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativo');
    // TODO: Implementar lógica de férias vencendo

    // Documentos expirando
    // TODO: Implementar

    return alertas;
  },

  async getKPIs() {
    const stats = await this.getStats();
    return {
      headcount: stats.colaboradoresAtivos,
      turnover: stats.turnover,
      absenteismo: stats.absenteismo,
      custoFolha: stats.folhaMensal,
    };
  },
};

export default dashboardService;
