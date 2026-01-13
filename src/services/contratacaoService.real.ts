// QA-FIX: ContratacaoService Real Implementation
import { supabase } from "@/integrations/supabase/client";

export interface ContratacaoData {
  id: string;
  nome?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ContratacaoServiceReal {
  private tableName = "contratacao";

  async listar(filters?: Record<string, any>) {
    let query = supabase.from(this.tableName).select("*");
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }

  async criar(dados: Partial<ContratacaoData>) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dados)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: Partial<ContratacaoData>) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(dados)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async excluir(id: string) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const contratacaoServiceReal = new ContratacaoServiceReal();
export default contratacaoServiceReal;
