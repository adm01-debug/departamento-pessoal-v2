import { supabase } from "@/integrations/supabase/client";

export interface Suspensao {
  id: string;
  colaborador_id: string;
  tipo: "disciplinar" | "contrato" | "medica" | "judicial";
  data_inicio: string;
  data_fim: string;
  dias: number;
  motivo: string;
  fundamentacao_legal?: string;
  numero_advertencias_previas: number;
  documento_url?: string;
  aplicador_id: string;
  status: "ativa" | "cumprida" | "cancelada" | "convertida";
  observacoes?: string;
  created_at: string;
}

class SuspensaoService {
  private tableName = "suspensoes";

  async listar(filtros?: { colaborador_id?: string; status?: string }): Promise<Suspensao[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filtros?.colaborador_id) query = query.eq("colaborador_id", filtros.colaborador_id);
    if (filtros?.status) query = query.eq("status", filtros.status);
    const { data, error } = await query.order("data_inicio", { ascending: false });
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<Suspensao | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(suspensao: Partial<Suspensao>): Promise<Suspensao> {
    const dias = this.calcularDias(suspensao.data_inicio!, suspensao.data_fim!);
    
    // Contar advertências prévias
    const { data: advertencias } = await supabase
      .from("advertencias")
      .select("id")
      .eq("colaborador_id", suspensao.colaborador_id);

    const { data, error } = await supabase
      .from(this.tableName)
      .insert([{ ...suspensao, dias, numero_advertencias_previas: advertencias?.length || 0, status: "ativa" }])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);

    // Criar afastamento correspondente
    await supabase.from("afastamentos").insert([{
      colaborador_id: suspensao.colaborador_id,
      tipo: "suspensao",
      data_inicio: suspensao.data_inicio,
      data_fim: suspensao.data_fim,
      motivo: suspensao.motivo
    }]);

    return data;
  }

  async cancelar(id: string, motivo: string): Promise<Suspensao> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "cancelada", observacoes: motivo })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async marcarCumprida(id: string): Promise<Suspensao> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "cumprida" })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async converterEmJustaCausa(id: string): Promise<Suspensao> {
    const suspensao = await this.buscarPorId(id);
    if (!suspensao) throw new Error("Suspensão não encontrada");

    // Criar registro de desligamento
    await supabase.from("desligamentos").insert([{
      colaborador_id: suspensao.colaborador_id,
      tipo: "justa_causa",
      motivo: `Conversão de suspensão: ${suspensao.motivo}`,
      data_desligamento: new Date().toISOString().split("T")[0]
    }]);

    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "convertida" })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  private calcularDias(inicio: string, fim: string): number {
    const d1 = new Date(inicio);
    const d2 = new Date(fim);
    return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  async obterHistorico(colaboradorId: string): Promise<Suspensao[]> {
    return this.listar({ colaborador_id: colaboradorId });
  }
}

export const suspensaoService = new SuspensaoService();
export default suspensaoService;
