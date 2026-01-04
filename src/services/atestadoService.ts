import { supabase } from "@/integrations/supabase/client";

export interface Atestado {
  id: string;
  colaborador_id: string;
  tipo: "medico" | "odontologico" | "acompanhamento" | "comparecimento";
  data_inicio: string;
  data_fim: string;
  dias_afastamento: number;
  cid?: string;
  crm_medico: string;
  nome_medico: string;
  arquivo_url?: string;
  status: "pendente" | "validado" | "rejeitado";
  observacoes?: string;
  created_at: string;
}

class AtestadoService {
  private tableName = "atestados";

  async listar(filtros?: { colaborador_id?: string; status?: string; data_inicio?: string; data_fim?: string }): Promise<Atestado[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filtros?.colaborador_id) query = query.eq("colaborador_id", filtros.colaborador_id);
    if (filtros?.status) query = query.eq("status", filtros.status);
    if (filtros?.data_inicio) query = query.gte("data_inicio", filtros.data_inicio);
    if (filtros?.data_fim) query = query.lte("data_fim", filtros.data_fim);
    const { data, error } = await query.order("data_inicio", { ascending: false });
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<Atestado | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(atestado: Partial<Atestado>): Promise<Atestado> {
    const dias = this.calcularDias(atestado.data_inicio!, atestado.data_fim!);
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([{ ...atestado, dias_afastamento: dias, status: "pendente" }])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async validar(id: string): Promise<Atestado> {
    const atestado = await this.buscarPorId(id);
    if (!atestado) throw new Error("Atestado não encontrado");

    // Criar afastamento automático
    await supabase.from("afastamentos").insert([{
      colaborador_id: atestado.colaborador_id,
      tipo: "atestado_medico",
      data_inicio: atestado.data_inicio,
      data_fim: atestado.data_fim,
      motivo: `Atestado médico - CID: ${atestado.cid || "N/I"}`,
      atestado_id: id
    }]);

    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "validado" })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async rejeitar(id: string, motivo: string): Promise<Atestado> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "rejeitado", observacoes: motivo })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  private calcularDias(inicio: string, fim: string): number {
    const d1 = new Date(inicio);
    const d2 = new Date(fim);
    return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  async obterResumo(colaboradorId: string, ano: number): Promise<{ total_atestados: number; total_dias: number }> {
    const atestados = await this.listar({ 
      colaborador_id: colaboradorId, 
      data_inicio: `${ano}-01-01`, 
      data_fim: `${ano}-12-31` 
    });
    return {
      total_atestados: atestados.length,
      total_dias: atestados.reduce((sum, a) => sum + a.dias_afastamento, 0)
    };
  }
}

export const atestadoService = new AtestadoService();
export default atestadoService;
