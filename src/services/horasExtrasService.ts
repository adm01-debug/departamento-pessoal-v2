import { supabase } from "@/integrations/supabase/client";

export interface HoraExtra {
  id: string;
  colaborador_id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  quantidade_horas: number;
  tipo: "50" | "100" | "noturna";
  percentual_adicional: number;
  motivo: string;
  aprovador_id?: string;
  status: "pendente" | "aprovada" | "rejeitada" | "paga" | "compensada";
  destino: "pagamento" | "banco_horas";
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
    const tipo = this.determinarTipo(horaExtra.data!, horaExtra.hora_inicio!, horaExtra.hora_fim!);
    const percentual = tipo === "50" ? 50 : tipo === "100" ? 100 : 20;

    const { data, error } = await supabase.from(this.tableName).insert([{
      ...horaExtra,
      quantidade_horas: horas,
      tipo,
      percentual_adicional: percentual,
      status: "pendente",
      destino: horaExtra.destino || "pagamento"
    }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async aprovar(id: string, aprovadorId: string): Promise<HoraExtra> {
    const { data, error } = await supabase.from(this.tableName).update({ status: "aprovada", aprovador_id: aprovadorId }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async rejeitar(id: string, motivo: string): Promise<HoraExtra> {
    const { data, error } = await supabase.from(this.tableName).update({ status: "rejeitada", observacoes: motivo }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async marcarPaga(id: string): Promise<HoraExtra> {
    const { data, error } = await supabase.from(this.tableName).update({ status: "paga" }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async marcarCompensada(id: string): Promise<HoraExtra> {
    const { data, error } = await supabase.from(this.tableName).update({ status: "compensada" }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  private calcularHoras(inicio: string, fim: string): number {
    const [hI, mI] = inicio.split(":").map(Number);
    const [hF, mF] = fim.split(":").map(Number);
    let minutos = (hF * 60 + mF) - (hI * 60 + mI);
    if (minutos < 0) minutos += 24 * 60;
    return minutos / 60;
  }

  private determinarTipo(data: string, inicio: string, fim: string): "50" | "100" | "noturna" {
    const dia = new Date(data).getDay();
    if (dia === 0 || dia === 6) return "100";
    
    const horaInicio = parseInt(inicio.split(":")[0]);
    if (horaInicio >= 22 || horaInicio < 5) return "noturna";
    
    return "50";
  }

  async calcularValor(id: string): Promise<{ valor_base: number; adicional: number; total: number }> {
    const he = await this.buscarPorId(id);
    if (!he) throw new Error("Hora extra não encontrada");

    const { data: colab } = await supabase.from("colaboradores").select("salario").eq("id", he.colaborador_id).single();
    if (!colab) throw new Error("Colaborador não encontrado");

    const valorHora = colab.salario / 220;
    const valorBase = valorHora * he.quantidade_horas;
    const adicional = valorBase * (he.percentual_adicional / 100);

    return { valor_base: valorBase, adicional, total: valorBase + adicional };
  }

  async obterResumoMensal(colaboradorId: string, mes: string): Promise<{ total_horas: number; valor_estimado: number; por_tipo: Record<string, number> }> {
    const [ano, mesNum] = mes.split("-");
    const horasExtras = await this.listar({
      colaborador_id: colaboradorId,
      data_inicio: `${ano}-${mesNum}-01`,
      data_fim: `${ano}-${mesNum}-31`,
      status: "aprovada"
    });

    const porTipo: Record<string, number> = { "50": 0, "100": 0, "noturna": 0 };
    let totalHoras = 0;
    let valorEstimado = 0;

    for (const he of horasExtras) {
      porTipo[he.tipo] += he.quantidade_horas;
      totalHoras += he.quantidade_horas;
      const { total } = await this.calcularValor(he.id);
      valorEstimado += total;
    }

    return { total_horas: totalHoras, valor_estimado: valorEstimado, por_tipo: porTipo };
  }
}

export const horasExtrasService = new HorasExtrasService();
export default horasExtrasService;
