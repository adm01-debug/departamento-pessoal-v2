import { supabase } from "@/integrations/supabase/client";

export interface Aumento {
  id: string;
  colaborador_id: string;
  tipo: "merito" | "promocao" | "dissidio" | "espontaneo" | "equiparacao";
  salario_anterior: number;
  salario_novo: number;
  percentual: number;
  valor_aumento: number;
  data_vigencia: string;
  motivo: string;
  aprovador_id?: string;
  status: "pendente" | "aprovado" | "rejeitado" | "aplicado";
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

class AumentoService {
  private tableName = "aumentos";

  async listar(filtros?: { colaborador_id?: string; status?: string }): Promise<Aumento[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filtros?.colaborador_id) query = query.eq("colaborador_id", filtros.colaborador_id);
    if (filtros?.status) query = query.eq("status", filtros.status);
    const { data, error } = await query.order("data_vigencia", { ascending: false });
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<Aumento | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(aumento: Partial<Aumento>): Promise<Aumento> {
    const percentual = aumento.salario_anterior && aumento.salario_novo 
      ? ((aumento.salario_novo - aumento.salario_anterior) / aumento.salario_anterior) * 100 
      : aumento.percentual || 0;
    const valorAumento = aumento.salario_novo && aumento.salario_anterior 
      ? aumento.salario_novo - aumento.salario_anterior 
      : 0;

    const { data, error } = await supabase
      .from(this.tableName)
      .insert([{ ...aumento, percentual, valor_aumento: valorAumento, status: "pendente" }])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async aprovar(id: string, aprovadorId: string): Promise<Aumento> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "aprovado", aprovador_id: aprovadorId, updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async rejeitar(id: string, motivo: string): Promise<Aumento> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "rejeitado", observacoes: motivo, updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async aplicar(id: string): Promise<Aumento> {
    const aumento = await this.buscarPorId(id);
    if (!aumento) throw new Error("Aumento não encontrado");
    if (aumento.status !== "aprovado") throw new Error("Aumento deve estar aprovado");

    await supabase.from("colaboradores").update({ salario: aumento.salario_novo }).eq("id", aumento.colaborador_id);

    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "aplicado", updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async calcularDissidio(empresaId: string, percentual: number, dataVigencia: string): Promise<Aumento[]> {
    const { data: colaboradores } = await supabase
      .from("colaboradores")
      .select("id, salario")
      .eq("empresa_id", empresaId)
      .eq("status", "ativo");

    if (!colaboradores) return [];

    const aumentos: Aumento[] = [];
    for (const colab of colaboradores) {
      const novoSalario = colab.salario * (1 + percentual / 100);
      const aumento = await this.criar({
        colaborador_id: colab.id,
        tipo: "dissidio",
        salario_anterior: colab.salario,
        salario_novo: novoSalario,
        percentual,
        data_vigencia: dataVigencia,
        motivo: `Dissídio coletivo ${percentual}%`
      });
      aumentos.push(aumento);
    }
    return aumentos;
  }
}

export const aumentoService = new AumentoService();
export default aumentoService;
