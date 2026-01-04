import { supabase } from "@/integrations/supabase/client";

export interface DashboardMetrics {
  totalColaboradores: number;
  colaboradoresAtivos: number;
  colaboradoresAfastados: number;
  admissoesNoMes: number;
  desligamentosNoMes: number;
  feriasVencidas: number;
  feriasAVencer: number;
  aniversariantesDoMes: number;
  folhaTotalMes: number;
  turnoverRate: number;
  absenteismoRate: number;
}

export interface DashboardChart {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface DashboardAlert {
  id: string;
  type: "warning" | "error" | "info" | "success";
  title: string;
  message: string;
  action?: string;
  actionUrl?: string;
  createdAt: string;
}

class DashboardService {
  async getMetrics(): Promise<DashboardMetrics> {
    const { data: colaboradores } = await supabase.from("colaboradores").select("*");
    const total = colaboradores?.length || 0;
    const ativos = colaboradores?.filter(c => c.status === "ativo").length || 0;
    const afastados = colaboradores?.filter(c => c.status === "afastado").length || 0;

    const mesAtual = new Date().toISOString().slice(0, 7);
    const admissoes = colaboradores?.filter(c => c.data_admissao?.startsWith(mesAtual)).length || 0;

    return {
      totalColaboradores: total,
      colaboradoresAtivos: ativos,
      colaboradoresAfastados: afastados,
      admissoesNoMes: admissoes,
      desligamentosNoMes: 0,
      feriasVencidas: 0,
      feriasAVencer: 0,
      aniversariantesDoMes: 0,
      folhaTotalMes: 0,
      turnoverRate: total > 0 ? (0 / total) * 100 : 0,
      absenteismoRate: 0,
    };
  }

  async getColaboradoresPorDepartamento(): Promise<DashboardChart[]> {
    const { data } = await supabase.from("colaboradores").select("departamento_id, departamentos(nome)");
    const counts: Record<string, number> = {};
    data?.forEach(c => {
      const dept = (c as any).departamentos?.nome || "Sem Departamento";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }

  async getColaboradoresPorCargo(): Promise<DashboardChart[]> {
    const { data } = await supabase.from("colaboradores").select("cargo_id, cargos(nome)");
    const counts: Record<string, number> = {};
    data?.forEach(c => {
      const cargo = (c as any).cargos?.nome || "Sem Cargo";
      counts[cargo] = (counts[cargo] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }

  async getEvolucaoHeadcount(meses: number = 12): Promise<{ mes: string; total: number }[]> {
    const result: { mes: string; total: number }[] = [];
    for (let i = meses - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      result.push({ mes: date.toISOString().slice(0, 7), total: 0 });
    }
    return result;
  }

  async getAlerts(): Promise<DashboardAlert[]> {
    return [
      { id: "1", type: "warning", title: "Férias Vencidas", message: "5 colaboradores com férias vencidas", action: "Ver lista", actionUrl: "/ferias", createdAt: new Date().toISOString() },
      { id: "2", type: "info", title: "Aniversariantes", message: "3 aniversariantes este mês", createdAt: new Date().toISOString() },
    ];
  }

  async getRecentActivities(): Promise<{ id: string; action: string; entity: string; user: string; timestamp: string }[]> {
    return [];
  }

  async getPendingApprovals(): Promise<{ id: string; type: string; description: string; requestedBy: string; requestedAt: string }[]> {
    return [];
  }

  async getKPIs(): Promise<{ name: string; value: number; target: number; unit: string; trend: "up" | "down" | "stable" }[]> {
    return [
      { name: "Turnover", value: 2.5, target: 3, unit: "%", trend: "down" },
      { name: "Absenteísmo", value: 1.8, target: 2, unit: "%", trend: "stable" },
      { name: "Satisfação", value: 85, target: 80, unit: "%", trend: "up" },
    ];
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
