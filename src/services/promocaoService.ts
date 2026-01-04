import { supabase } from "@/integrations/supabase/client";

export interface Promocao {
  id: string;
  colaborador_id: string;
  cargo_anterior_id: string;
  cargo_novo_id: string;
  departamento_anterior_id?: string;
  departamento_novo_id?: string;
  salario_anterior: number;
  salario_novo: number;
  percentual_aumento: number;
  data_vigencia: string;
  motivo: string;
  aprovador_id?: string;
  status: "pendente" | "aprovada" | "rejeitada" | "aplicada";
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

class PromocaoService {
  private tableName = "promocoes";

  async listar(filtros?: { colaborador_id?: string; status?: string }): Promise<Promocao[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filtros?.colaborador_id) query = query.eq("colaborador_id", filtros.colaborador_id);
    if (filtros?.status) query = query.eq("status", filtros.status);
    const { data, error } = await query.order("data_vigencia", { ascending: false });
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<Promocao | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(promocao: Partial<Promocao>): Promise<Promocao> {
    const percentual = promocao.salario_anterior && promocao.salario_novo 
      ? ((promocao.salario_novo - promocao.salario_anterior) / promocao.salario_anterior) * 100 
      : 0;

    const { data, error } = await supabase
      .from(this.tableName)
      .insert([{ ...promocao, percentual_aumento: percentual, status: "pendente" }])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async aprovar(id: string, aprovadorId: string): Promise<Promocao> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "aprovada", aprovador_id: aprovadorId, updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async rejeitar(id: string, motivo: string): Promise<Promocao> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "rejeitada", observacoes: motivo, updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async aplicar(id: string): Promise<Promocao> {
    const promocao = await this.buscarPorId(id);
    if (!promocao) throw new Error("Promoção não encontrada");
    if (promocao.status !== "aprovada") throw new Error("Promoção deve estar aprovada");

    await supabase.from("colaboradores").update({ 
      cargo_id: promocao.cargo_novo_id,
      departamento_id: promocao.departamento_novo_id || promocao.departamento_anterior_id,
      salario: promocao.salario_novo 
    }).eq("id", promocao.colaborador_id);

    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "aplicada", updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async obterHistorico(colaboradorId: string): Promise<Promocao[]> {
    return this.listar({ colaborador_id: colaboradorId });
  }
}

export const promocaoService = new PromocaoService();
export default promocaoService;
