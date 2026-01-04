import { supabase } from "@/integrations/supabase/client";

export interface Advertencia {
  id: string;
  colaborador_id: string;
  tipo: "verbal" | "escrita";
  data_ocorrencia: string;
  data_aplicacao: string;
  motivo: string;
  descricao_fato: string;
  fundamentacao_legal?: string;
  testemunhas?: string[];
  aplicador_id: string;
  documento_url?: string;
  assinada: boolean;
  data_assinatura?: string;
  recusou_assinar: boolean;
  observacoes?: string;
  created_at: string;
}

class AdvertenciaService {
  private tableName = "advertencias";

  async listar(filtros?: { colaborador_id?: string; tipo?: string }): Promise<Advertencia[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filtros?.colaborador_id) query = query.eq("colaborador_id", filtros.colaborador_id);
    if (filtros?.tipo) query = query.eq("tipo", filtros.tipo);
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
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([{ ...advertencia, assinada: false, recusou_assinar: false }])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async registrarAssinatura(id: string): Promise<Advertencia> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ assinada: true, data_assinatura: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async registrarRecusa(id: string, testemunhas: string[]): Promise<Advertencia> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ recusou_assinar: true, testemunhas })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async contarAdvertencias(colaboradorId: string, meses: number = 12): Promise<{ verbais: number; escritas: number; total: number }> {
    const dataLimite = new Date();
    dataLimite.setMonth(dataLimite.getMonth() - meses);

    const advertencias = await this.listar({ colaborador_id: colaboradorId });
    const recentes = advertencias.filter(a => new Date(a.data_aplicacao) >= dataLimite);

    return {
      verbais: recentes.filter(a => a.tipo === "verbal").length,
      escritas: recentes.filter(a => a.tipo === "escrita").length,
      total: recentes.length
    };
  }

  async verificarProgressaoDisciplinar(colaboradorId: string): Promise<{ proxima_acao: string; advertencias_recentes: number }> {
    const contagem = await this.contarAdvertencias(colaboradorId, 12);
    
    let proximaAcao = "advertencia_verbal";
    if (contagem.verbais >= 2) proximaAcao = "advertencia_escrita";
    if (contagem.escritas >= 2) proximaAcao = "suspensao";
    if (contagem.total >= 5) proximaAcao = "justa_causa";

    return { proxima_acao: proximaAcao, advertencias_recentes: contagem.total };
  }

  async obterHistorico(colaboradorId: string): Promise<Advertencia[]> {
    return this.listar({ colaborador_id: colaboradorId });
  }
}

export const advertenciaService = new AdvertenciaService();
export default advertenciaService;
