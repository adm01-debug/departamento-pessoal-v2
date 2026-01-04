import { supabase } from "@/integrations/supabase/client";

export interface Advertencia {
  id: string;
  colaborador_id: string;
  tipo: "verbal" | "escrita";
  data_ocorrencia: string;
  data_aplicacao: string;
  motivo: string;
  descricao: string;
  fundamentacao_legal?: string;
  testemunha1?: string;
  testemunha2?: string;
  aplicador_id: string;
  documento_url?: string;
  assinatura_colaborador: boolean;
  recusa_assinar: boolean;
  motivo_recusa?: string;
  status: "aplicada" | "contestada" | "anulada";
  created_at: string;
}

class AdvertenciaService {
  private tableName = "advertencias";

  async listar(filtros?: { colaborador_id?: string; tipo?: string; status?: string }): Promise<Advertencia[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filtros?.colaborador_id) query = query.eq("colaborador_id", filtros.colaborador_id);
    if (filtros?.tipo) query = query.eq("tipo", filtros.tipo);
    if (filtros?.status) query = query.eq("status", filtros.status);
    const { data, error } = await query.order("data_aplicacao", { ascending: false });
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<Advertencia | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(advertencia: Partial<Advertencia>): Promise<Advertencia> {
    const { data, error } = await supabase.from(this.tableName).insert([{
      ...advertencia,
      data_aplicacao: new Date().toISOString().split("T")[0],
      assinatura_colaborador: false,
      recusa_assinar: false,
      status: "aplicada"
    }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async registrarAssinatura(id: string): Promise<Advertencia> {
    const { data, error } = await supabase.from(this.tableName).update({ assinatura_colaborador: true }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async registrarRecusa(id: string, motivo: string): Promise<Advertencia> {
    const { data, error } = await supabase.from(this.tableName).update({ recusa_assinar: true, motivo_recusa: motivo }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async contestar(id: string, contestacao: string): Promise<Advertencia> {
    const { data, error } = await supabase.from(this.tableName).update({ status: "contestada" }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    
    await supabase.from("contestacoes_advertencia").insert([{ advertencia_id: id, texto: contestacao, data: new Date().toISOString() }]);
    return data;
  }

  async anular(id: string, motivo: string): Promise<Advertencia> {
    const { data, error } = await supabase.from(this.tableName).update({ status: "anulada" }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async contarAdvertencias(colaboradorId: string, meses: number = 12): Promise<{ verbais: number; escritas: number; total: number }> {
    const dataLimite = new Date();
    dataLimite.setMonth(dataLimite.getMonth() - meses);
    
    const advertencias = await this.listar({ colaborador_id: colaboradorId });
    const recentes = advertencias.filter(a => new Date(a.data_aplicacao) >= dataLimite && a.status === "aplicada");
    
    return {
      verbais: recentes.filter(a => a.tipo === "verbal").length,
      escritas: recentes.filter(a => a.tipo === "escrita").length,
      total: recentes.length
    };
  }

  async verificarProgressaoDisciplinar(colaboradorId: string): Promise<string> {
    const { verbais, escritas, total } = await this.contarAdvertencias(colaboradorId);
    
    if (total === 0) return "sem_ocorrencias";
    if (verbais >= 1 && escritas === 0) return "advertencia_verbal";
    if (escritas === 1) return "advertencia_escrita";
    if (escritas === 2) return "suspensao_recomendada";
    if (escritas >= 3) return "demissao_justa_causa_possivel";
    return "em_acompanhamento";
  }
}

export const advertenciaService = new AdvertenciaService();
export default advertenciaService;
