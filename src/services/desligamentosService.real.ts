// QA-FIX: DesligamentosService Real Implementation
import { supabase } from "@/integrations/supabase/client";

export interface DesligamentosData {
  id: string;
  nome?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DesligamentosServiceReal {
  private tableName = "desligamentos";

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

  async criar(dados: Partial<DesligamentosData>) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dados)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: Partial<DesligamentosData>) {
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

export const desligamentosServiceReal = new DesligamentosServiceReal();
export default desligamentosServiceReal;
