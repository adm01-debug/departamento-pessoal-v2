import { supabase } from "@/integrations/supabase/client";

export interface HoraExtra {
  id: string;
  colaborador_id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  horas: number;
  tipo: "50" | "100" | "noturna";
  motivo: string;
  aprovador_id?: string;
  status: "pendente" | "aprovada" | "rejeitada" | "paga" | "compensada";
  ponto_id?: string;
  valor?: number;
  observacoes?: string;
  created_at: string;
}

class HorasExtrasService {
  private tableName = "horas_extras";

  async listar(filtros?: { colaborador_id?: string; status?: string; data_inicio?: string; data_fim?: string }): Promise<HoraExtra[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filtros?.colaborador_id) query = query.eq("colaborador_id", filtros.colaborador_id);
    if (filtros?.status) query = query.eq("status", filtros.status);
    if (filtros?.data_inicio) query = query.gte("data", filtros.data_inicio);
    if (filtros?.data_fim) query = query.lte("data", filtros.data_fim);
    const { data, error } = await query.order("data", { ascending: false });
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<HoraExtra | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(horaExtra: Partial<HoraExtra>): Promise<HoraExtra> {
    const horas = this.calcularHoras(horaExtra.hora_inicio!, horaExtra.hora_fim!);
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([{ ...horaExtra, horas, status: "pendente" }])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async aprovar(id: string, aprovadorId: string): Promise<HoraExtra> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "aprovada", aprovador_id: aprovadorId })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async rejeitar(id: string, motivo: string): Promise<HoraExtra> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "rejeitada", observacoes: motivo })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async marcarPaga(id: string, valor: number): Promise<HoraExtra> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "paga", valor })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async marcarCompensada(id: string): Promise<HoraExtra> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "compensada" })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  private calcularHoras(inicio: string, fim: string): number {
    const [hI, mI] = inicio.split(":").map(Number);
    const [hF, mF] = fim.split(":").map(Number);
    return ((hF * 60 + mF) - (hI * 60 + mI)) / 60;
  }

  async calcularValor(colaboradorId: string, horas: number, tipo: "50" | "100" | "noturna"): Promise<number> {
    const { data: colaborador } = await supabase.from("colaboradores").select("salario").eq("id", colaboradorId).single();
    if (!colaborador) return 0;

    const valorHora = colaborador.salario / 220;
    const multiplicador = tipo === "50" ? 1.5 : tipo === "100" ? 2 : 1.2;
    return valorHora * multiplicador * horas;
  }

  async obterResumoMensal(colaboradorId: string, mes: string): Promise<{ total_horas: number; horas_50: number; horas_100: number; valor_total: number }> {
    const [ano, mesNum] = mes.split("-");
    const dataInicio = `${ano}-${mesNum}-01`;
    const dataFim = new Date(Number(ano), Number(mesNum), 0).toISOString().split("T")[0];

    const horas = await this.listar({ colaborador_id: colaboradorId, data_inicio: dataInicio, data_fim: dataFim, status: "aprovada" });

    return {
      total_horas: horas.reduce((sum, h) => sum + h.horas, 0),
      horas_50: horas.filter(h => h.tipo === "50").reduce((sum, h) => sum + h.horas, 0),
      horas_100: horas.filter(h => h.tipo === "100").reduce((sum, h) => sum + h.horas, 0),
      valor_total: horas.reduce((sum, h) => sum + (h.valor || 0), 0)
    };
  }
}

export const horasExtrasService = new HorasExtrasService();
export default horasExtrasService;
